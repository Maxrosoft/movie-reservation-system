import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import ErrorMessageI from "../interfaces/errorMessageI";

const ADMIN_TOKEN_SECRET: string = process.env.ADMIN_TOKEN_SECRET as string;

export default function authenticateAdminToken(req: Request, res: Response, next: NextFunction) {
    const { adminToken } = req.cookies;
    if (adminToken == null) {
        const errorMessage: ErrorMessageI = { type: "error", message: "Unauthorized", code: 401 };
        return res.status(errorMessage.code).send(errorMessage);
    }
    try {
        const decoded: JwtPayload = jwt.verify(adminToken, ADMIN_TOKEN_SECRET) as JwtPayload;
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        next(error);
    }
}
