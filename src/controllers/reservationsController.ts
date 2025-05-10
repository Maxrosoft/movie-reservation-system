import { Request, Response, NextFunction } from "express";
import Hall from "../models/Hall";
import Showtime from "../models/Showtime";
import Reservation from "../models/Reservation";
import SuccessMessageI from "../interfaces/successMessageI";
import ErrorMessageI from "../interfaces/errorMessageI";

async function showtimeExists(showtimeId: number): Promise<boolean> {
    const showtime: any = await Showtime.findByPk(showtimeId);
    return !!showtime;
}

async function seatsExist(seats: string[], showtimeId: number): Promise<boolean> {
    const showtime: any = await Showtime.findByPk(showtimeId);
    const hallId: any = showtime.hallId;
    const hall: any = await Hall.findByPk(hallId);
    const seatsInHall: string[] = hall.seats.map((seat: any) => seat.seatId);
    return seats.every((seat: string) => seatsInHall.includes(seat));
}

async function markSeatsAsOccupied(seats: string[], showtimeId: number): Promise<void> {
    const showtime: any = await Showtime.findByPk(showtimeId);
    showtime.occupiedSeats = [...showtime.occupiedSeats, ...seats];
    await showtime.save();
}

async function removeSeatsFromOccupied(seats: string[], showtimeId: number): Promise<void> {
    const showtime: any = await Showtime.findByPk(showtimeId);
    showtime.occupiedSeats = showtime.occupiedSeats.filter((seat: string) => !seats.includes(seat));
    await showtime.save();
}

async function showtimeAlreadyStarted(showtimeId: number): Promise<boolean> {
    const showtime: any = await Showtime.findByPk(showtimeId);
    return showtime.startTime <= Date.now() - 3 * 60 * 60 * 1000;
}

async function seatsAlreadyReserved(seats: string[], showtimeId: number): Promise<boolean> {
    const showtime: any = await Showtime.findByPk(showtimeId);
    return showtime.occupiedSeats.some((seat: string) => seats.includes(seat));
}

async function calculateTotalPrice(seats: string[], showtimeId: number): Promise<number> {
    const showtime: any = await Showtime.findByPk(showtimeId);
    const hallId: any = showtime.hallId;
    const hall: any = await Hall.findByPk(hallId);
    const showtimePrice: number = showtime.price;
    const hallPriceMultiplier: number = hall.priceMultiplier;
    const hallSeats: any[] = hall.seats;
    return seats.reduce(
        (total, seat) =>
            total + showtimePrice * hallPriceMultiplier * hallSeats.find((s) => s.seatId === seat).priceMultiplier,
        0
    );
}

class ReservationsController {
    async book(req: Request, res: Response, next: NextFunction) {
        try {
            const { showtimeId, seats } = req.body;
            const { userId } = req as any;

            if (!(showtimeId !== undefined && seats !== undefined)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Missed required parameter",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }

            if (!(await showtimeExists(showtimeId))) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Showtime not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }

            if (!(await seatsExist(seats, showtimeId))) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Seats not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }

            if (await seatsAlreadyReserved(seats, showtimeId)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Seats already reserved",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }

            const reservation: any = await Reservation.create({ showtimeId, seats, userId, totalPrice: await calculateTotalPrice(seats, showtimeId) });
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Reservation added successfully",
                data: { reservationId: reservation.id },
                code: 201,
            };
            await markSeatsAsOccupied(seats, showtimeId);
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }

    async cancel(req: Request, res: Response, next: NextFunction) {
        try {
            const { reservationId } = req.params;
            const { userId } = req as any;
            const reservation: any = await Reservation.findOne({ where: { id: reservationId, userId } });
            if (!reservation) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Reservation not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
            const showtimeId: any = reservation.showtimeId;
            const seats: string[] = reservation.seats;

            if (await showtimeAlreadyStarted(showtimeId)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Showtime already started",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
            await removeSeatsFromOccupied(seats, showtimeId);
            await reservation.destroy();
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Reservation canceled successfully",
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }

    async getUsersReservations(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req as any;
            const page: number = Number(req.query.page) || 1;
            const limit: number = Number(req.query.limit) || 10;
            const offset: number = (page - 1) * limit;
            const reservations: any[] = await Reservation.findAll({ where: { userId }, limit, offset });
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Reservations found successfully",
                data: { page, limit, reservations },
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }
}

export default ReservationsController;
