import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import SuccessMessageI from "../interfaces/successMessageI";
import ErrorMessageI from "../interfaces/errorMessageI";

class UsersController {
    async promote(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params;
            const userToPromote: any = await User.findByPk(userId);
            if (userToPromote && userToPromote.role === "user") {
                await userToPromote.update({ role: "admin" });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "User promoted successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "User not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default UsersController;
