import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import ErrorMessageI from "../interfaces/errorMessageI";
import SuccessMessageI from "../interfaces/successMessageI";
import User from "../models/User";

const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

async function hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    const salt: string = await bcrypt.genSalt(saltRounds);
    const hashedPassword: string = await bcrypt.hash(password, salt);
    return hashedPassword;
}

function generateToken(userId: number): string {
    return jwt.sign({ userId }, TOKEN_SECRET, { expiresIn: "7d" });
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
                return res.status(errorMessage.code).send(errorMessage);
            }

            const hashedPassword: string = await hashPassword(password);

            await User.create({ firstName, lastName, email, hashedPassword });

            const successMessage: SuccessMessageI = {
                type: "success",
                message: "User registered successfully",
                code: 201,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            if (!(email && password)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Missed required parameter",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }

            const foundUser: any = await User.findOne({ where: { email } });
            const passwordsMatch: boolean = await bcrypt.compare(password, foundUser?.hashedPassword);
            if (passwordsMatch) {
                const token: string = generateToken(foundUser.id);
                res.cookie("token", token, {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    httpOnly: true,
                    sameSite: "strict",
                });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "User logged in successfully",
                    data: { token },
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Wrong email or password",
                    code: 401,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req as any;
            const foundUser: any = await User.findByPk(userId);
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Authorized",
                data: {
                    UserId: foundUser.id,
                    firstName: foundUser.firstName,
                    lastName: foundUser.lastName,
                    email: foundUser.email,
                    role: foundUser.role,
                },
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
