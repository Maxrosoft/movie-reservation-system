import { Request, Response, NextFunction } from "express";
import Hall from "../models/Hall";
import SuccessMessageI from "../interfaces/successMessageI";
import ErrorMessageI from "../interfaces/errorMessageI";

class HallsController {
    async addOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, seats, priceMultiplier } = req.body;
            if (!(name && seats && priceMultiplier)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Missed required parameter",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }

            await Hall.create({ name, seats, priceMultiplier });
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Hall added successfully",
                code: 201,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }

    async fetchAll(req: Request, res: Response, next: NextFunction) {
        try {
            const halls = await Hall.findAll();
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Halls fetched successfully",
                data: { halls },
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }

    async fetchOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { hallId } = req.params;
            const hall = await Hall.findByPk(hallId);
            if (hall) {
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Hall fetched successfully",
                    data: { hall },
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Hall not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }

    async changeOneCompletely(req: Request, res: Response, next: NextFunction) {
        try {
            const { hallId } = req.params;
            const hall = await Hall.findByPk(hallId);
            if (hall) {
                const { name, seats, priceMultiplier } = req.body;
                if (!(name && seats && priceMultiplier)) {
                    const errorMessage: ErrorMessageI = {
                        type: "error",
                        message: "Missed required parameter",
                        code: 400,
                    };
                    return res.status(errorMessage.code).send(errorMessage);
                }
                await hall.update({ name, seats, priceMultiplier });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Hall updated successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Hall not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }

    async changeOnePartly(req: Request, res: Response, next: NextFunction) {
        try {
            const { hallId } = req.params;
            const hall = await Hall.findByPk(hallId);
            if (hall) {
                const { name, seats, priceMultiplier } = req.body;
                await hall.update({ name, seats, priceMultiplier });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Hall details changed successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Hall not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }

    async removeOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { hallId } = req.params;
            const hall = await Hall.findByPk(hallId);
            if (hall) {
                await hall.destroy();
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Hall deleted successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Hall not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default HallsController;
