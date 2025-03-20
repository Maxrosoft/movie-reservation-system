import { Request, Response, NextFunction } from "express";
import ErrorMessageI from "../interfaces/errorMessageI";

export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    const errorMessage: ErrorMessageI = {
        type: "error",
        message: err.message,
        code: 500,
    };
    return res.status(errorMessage.code).send(errorMessage);
}
