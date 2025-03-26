import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import ErrorMessageI from "../interfaces/errorMessageI";

const SUPER_ADMIN_TOKEN_SECRET: string = process.env.SUPER_ADMIN_TOKEN_SECRET as string;

export default function authenticateSuperAdminToken(req: Request, res: Response, next: NextFunction) {
    const { superAdminToken } = req.cookies;
    if (superAdminToken == null) {
        const errorMessage: ErrorMessageI = { type: "error", message: "Unauthorized", code: 401 };
        return res.status(errorMessage.code).send(errorMessage);
    }
    try {
        const decoded: JwtPayload = jwt.verify(superAdminToken, SUPER_ADMIN_TOKEN_SECRET) as JwtPayload;
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        next(error);
    }
}
