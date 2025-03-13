import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import ErrorMessageI from "../interfaces/errorMessageI";
import SuccessMessageI from "../interfaces/successMessageI";
import User from "../models/User";

async function hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    const salt: string = await bcrypt.genSalt(saltRounds);
    const hashedPassword: string = await bcrypt.hash(password, salt);
    return hashedPassword;
}

class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password } = req.body;
            if (!(firstName && lastName && email && password)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Missed required parameter",
                    code: 400,
                };
                res.status(errorMessage.code).send(errorMessage);
            }

            const hashedPassword: string = await hashPassword(password);

            await User.create({ firstName, lastName, email, hashedPassword });

            const successMessage: SuccessMessageI = {
                type: "success",
                message: "User registered successfully",
                code: 201,
            };
            res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
