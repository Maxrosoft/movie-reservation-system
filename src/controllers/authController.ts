import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import ErrorMessageI from "../interfaces/errorMessageI";
import SuccessMessageI from "../interfaces/successMessageI";
import User from "../models/User";
import passwordValidationSchema from "../utils/passwordValidationSchema";

const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;
const ADMIN_TOKEN_SECRET: string = process.env.ADMIN_TOKEN_SECRET as string;
const SUPER_ADMIN_TOKEN_SECRET: string = process.env.SUPER_ADMIN_TOKEN_SECRET as string;

export async function hashPassword(password: string): Promise<string> {
    const saltRounds: number = 10;
    const salt: string = await bcrypt.genSalt(saltRounds);
    const hashedPassword: string = await bcrypt.hash(password, salt);
    return hashedPassword;
}

function generateToken(userId: number): string {
    return jwt.sign({ userId }, TOKEN_SECRET, { expiresIn: "7d" });
}

function generateAdminToken(adminId: number): string {
    return jwt.sign({ adminId }, ADMIN_TOKEN_SECRET, { expiresIn: "1h" });
}

function generateSuperAdminToken(superAdminId: number): string {
    return jwt.sign({ superAdminId }, SUPER_ADMIN_TOKEN_SECRET, { expiresIn: "15m" });
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
            const passwordValidationDetails: any = passwordValidationSchema.validate(password, { details: true });
            if (passwordValidationDetails.length > 0) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Passowrd validation failed",
                    data: passwordValidationDetails,
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
            let roleInMessage: string = "User";
            if (passwordsMatch) {
                res.clearCookie("token");
                res.clearCookie("adminToken");
                res.clearCookie("superAdminToken");
                let adminToken: string = "";
                let superAdminToken: string = "";
                if (foundUser.role === "admin" || foundUser.role === "superAdmin") {
                    roleInMessage = "Administrator";
                    adminToken = generateAdminToken(foundUser.id);
                    res.cookie("adminToken", adminToken, {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true,
                        sameSite: "strict",
                    });
                }
                if (foundUser.role === "superAdmin") {
                    roleInMessage = "Super Administrator";
                    superAdminToken = generateSuperAdminToken(foundUser.id);
                    res.cookie("superAdminToken", superAdminToken, {
                        maxAge: 1000 * 60 * 15,
                        httpOnly: true,
                        sameSite: "strict",
                    });
                }
                const token: string = generateToken(foundUser.id);
                res.cookie("token", token, {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    httpOnly: true,
                    sameSite: "strict",
                });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: `${roleInMessage} logged in successfully`,
                    data: superAdminToken
                        ? { token, adminToken, superAdminToken }
                        : adminToken
                        ? { token, adminToken }
                        : { token },
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

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            res.clearCookie("token");
            res.clearCookie("adminToken");
            res.clearCookie("superAdminToken");
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Logged out successfully",
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req as any;
            const foundUser: any = await User.findByPk(userId);
            res.clearCookie("token");
            res.clearCookie("adminToken");
            res.clearCookie("superAdminToken");
            let roleInMessage: string = "User";
            let adminToken: string = "";
            let superAdminToken: string = "";
            if (foundUser.role === "admin" || foundUser.role === "superAdmin") {
                roleInMessage = "Administrator";
                adminToken = generateAdminToken(foundUser.id);
                res.cookie("adminToken", adminToken, {
                    maxAge: 1000 * 60 * 60,
                    httpOnly: true,
                    sameSite: "strict",
                });
            }
            if (foundUser.role === "superAdmin") {
                roleInMessage = "Super Administrator";
                superAdminToken = generateSuperAdminToken(foundUser.id);
                res.cookie("superAdminToken", superAdminToken, {
                    maxAge: 1000 * 60 * 15,
                    httpOnly: true,
                    sameSite: "strict",
                });
            }
            const token: string = generateToken(foundUser.id);
            res.cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
                sameSite: "strict",
            });
            const successMessage: SuccessMessageI = {
                type: "success",
                message: `Refreshed successfully for ${roleInMessage}`,
                data: superAdminToken
                    ? { token, adminToken, superAdminToken }
                    : adminToken
                    ? { token, adminToken }
                    : { token },
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req as any;
            const { oldPassword, newPassword } = req.body;
            if (!(oldPassword && newPassword)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Missed required parameter",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }

            const foundUser: any = await User.findByPk(userId);
            const passwordsMatch: boolean = await bcrypt.compare(oldPassword, foundUser?.hashedPassword);
            if (passwordsMatch) {
                const passwordValidationDetails: any = passwordValidationSchema.validate(newPassword, {
                    details: true,
                });
                if (passwordValidationDetails.length > 0) {
                    const errorMessage: ErrorMessageI = {
                        type: "error",
                        message: "Passowrd validation failed",
                        data: passwordValidationDetails,
                        code: 400,
                    };
                    return res.status(errorMessage.code).send(errorMessage);
                }
                const hashedPassword: string = await bcrypt.hash(newPassword, 10);
                await foundUser.update({ hashedPassword });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Password changed successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Wrong password",
                    code: 401,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
