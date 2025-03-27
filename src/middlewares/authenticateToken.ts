import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import ErrorMessageI from "../interfaces/errorMessageI";

const TOKEN_SECRET: string = process.env.TOKEN_SECRET as string;

export default function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const { token } = req.cookies;
    if (token == null) {
        const errorMessage: ErrorMessageI = { type: "error", message: "Unauthorized", code: 401 };
        return res.status(errorMessage.code).send(errorMessage);
    }
    try {
        const decoded: JwtPayload = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        next(error);
    }
}
