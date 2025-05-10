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


async function checkIfReserved(seats: string[], showtimeId: number): Promise<boolean> {
    const showtime: any = await Showtime.findByPk(showtimeId);
    return showtime.occupiedSeats.some((seat: string) => seats.includes(seat));
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

            if (await checkIfReserved(seats, showtimeId)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Seats already reserved",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }

            const reservation: any = await Reservation.create({ showtimeId, seats, userId });
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
}

export default ReservationsController;
