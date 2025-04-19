import { Request, Response, NextFunction } from "express";
import Showtime from "../models/Showtime";
import ErrorMessageI from "../interfaces/errorMessageI";
import SuccessMessageI from "../interfaces/successMessageI";
import Movie from "../models/Movie";

class ShowtimesController {
    async addOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { movieId, startTime, hallType, price } = req.body;
            if (!(movieId && startTime && hallType)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Missed required parameter",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
            await Showtime.create({ movieId, startTime, hallType, price });
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Showtime added successfully",
                code: 201,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }
    async fetchAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page: number = Number(req.query.page) || 1;
            const limit: number = Number(req.query.limit) || 10;
            const offset: number = (page - 1) * limit;
            const showtimes: any[] = await Showtime.findAll({ limit, offset });
            const publicShowtimes: any[] = [];
            for (let showtime of showtimes) {
                const movie: any = await Movie.findByPk(showtime.movieId);
                const publicMovie: any = {
                    title: movie.title,
                    description: movie.description,
                    posterUrl: movie.posterUrl,
                    genres: movie.genres,
                };
                publicShowtimes.push({
                    movie: publicMovie,
                    startTime: showtime.startTime,
                    hallType: showtime.hallType,
                    price: showtime.price,
                });
            }
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Showtimes fetched successfully",
                data: { page, limit, showtimes: publicShowtimes },
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }
    async fetchOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { showtimeId } = req.params;
            const showtime: any = await Showtime.findByPk(showtimeId);
            if (showtime) {
                const movie: any = await Movie.findByPk(showtime.movieId);
                const publicMovie: any = {
                    title: movie.title,
                    description: movie.description,
                    posterUrl: movie.posterUrl,
                    genres: movie.genres,
                };
                const publicShowtime: any = {
                    movie: publicMovie,
                    startTime: showtime.startTime,
                    hallType: showtime.hallType,
                    price: showtime.price,
                };
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Showtime fetched successfully",
                    data: { showtime: publicShowtime },
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Showtime not found",
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
            const { showtimeId } = req.params;
            const showtime: any = await Showtime.findByPk(showtimeId);
            if (showtime) {
                const { movieId, startTime, hallType, price } = req.body;
                if (!(movieId && startTime && hallType)) {
                    const errorMessage: ErrorMessageI = {
                        type: "error",
                        message: "Missed required parameter",
                        code: 400,
                    };
                    return res.status(errorMessage.code).send(errorMessage);
                }
                await showtime.update({ movieId, startTime, hallType, price });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Showtime changed successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Showtime not found",
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
            const { showtimeId } = req.params;
            const showtime: any = await Showtime.findByPk(showtimeId);
            if (showtime) {
                const { movieId, startTime, hallType, price } = req.body;
                if (!(movieId || startTime || hallType)) {
                    const errorMessage: ErrorMessageI = {
                        type: "error",
                        message: "Missed required parameter",
                        code: 400,
                    };
                    return res.status(errorMessage.code).send(errorMessage);
                }
                await showtime.update({ movieId, startTime, hallType, price });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Showtime details changed successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Showtime not found",
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
            const { showtimeId } = req.params;
            const showtime: any = await Showtime.findByPk(showtimeId);
            if (showtime) {
                await showtime.destroy();
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Showtime deleted successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Showtime not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default ShowtimesController;

