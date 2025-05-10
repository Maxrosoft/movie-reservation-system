import { Request, Response, NextFunction } from "express";
import Reservation from "../models/Reservation";
import Showtime from "../models/Showtime";
import SuccessMessageI from "../interfaces/successMessageI";
import ErrorMessageI from "../interfaces/errorMessageI";

class AdminController {
    async getAllReservations(req: Request, res: Response, next: NextFunction) {
        try {
            const page: number = Number(req.query.page) || 1;
            const limit: number = Number(req.query.limit) || 10;
            const offset: number = (page - 1) * limit;
            const reservations: any[] = await Reservation.findAll({ limit, offset });
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

    async getReports(req: Request, res: Response, next: NextFunction) {
        try {
            const totalReservations: number = await Reservation.count();
            const totalRevenue: number = await Reservation.sum("totalPrice");
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Reports found successfully",
                data: { totalReservations, totalRevenue },
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }
}

export default AdminController;
