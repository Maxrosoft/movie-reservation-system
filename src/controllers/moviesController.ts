import { Request, Response, NextFunction } from "express";
import Movie from "../models/Movie";
import ErrorMessageI from "../interfaces/errorMessageI";
import SuccessMessageI from "../interfaces/successMessageI";
import Showtime from "../models/Showtime";

class MoviesController {
    async addOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { title, description, posterUrl, genres } = req.body;
            if (!(title && description && posterUrl && genres)) {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Missed required parameter",
                    code: 400,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
            await Movie.create({ title, description, posterUrl, genres });
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Movie added successfully",
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
            const movies: any[] = await Movie.findAll({ limit, offset });
            const successMessage: SuccessMessageI = {
                type: "success",
                message: "Movies fetched successfully",
                data: { page, limit, movies },
                code: 200,
            };
            return res.status(successMessage.code).send(successMessage);
        } catch (error) {
            next(error);
        }
    }
    async fetchOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { movieId } = req.params;
            const movie: any = await Movie.findByPk(movieId);
            if (movie) {
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Movie fetched successfully",
                    data: { movie },
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Movie not found",
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
            const { movieId } = req.params;
            const movie: any = await Movie.findByPk(movieId);
            if (movie) {
                const { title, description, posterUrl, genres } = req.body;
                if (!(title && description && posterUrl && genres)) {
                    const errorMessage: ErrorMessageI = {
                        type: "error",
                        message: "Missed required parameter",
                        code: 400,
                    };
                    return res.status(errorMessage.code).send(errorMessage);
                }
                await movie.update({ title, description, posterUrl, genres });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Movie changed successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Movie not found",
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
            const { movieId } = req.params;
            const movie: any = await Movie.findByPk(movieId);
            if (movie) {
                const { title, description, posterUrl, genres } = req.body;
                if (!(title || description || posterUrl || genres)) {
                    const errorMessage: ErrorMessageI = {
                        type: "error",
                        message: "Missed required parameter",
                        code: 400,
                    };
                    return res.status(errorMessage.code).send(errorMessage);
                }
                await movie.update({ title, description, posterUrl, genres });
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Movie details changed successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Movie not found",
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
            const { movieId } = req.params;
            const movie: any = await Movie.findByPk(movieId);
            if (movie) {
                await movie.destroy();
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Movie deleted successfully",
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Movie not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }
    async getShowtimes(req: Request, res: Response, next: NextFunction) {
        try {
            const { movieId } = req.params;
            const movie: any = await Movie.findByPk(movieId);

            if (movie) {
                const publicMovie: any = {
                    title: movie.title,
                    description: movie.description,
                    posterUrl: movie.posterUrl,
                    genres: movie.genres,
                };
                const page: number = Number(req.query.page) || 1;
                const limit: number = Number(req.query.limit) || 10;
                const offset: number = (page - 1) * limit;
                const showtimes: any[] = await Showtime.findAll({ where: { movieId }, limit, offset });
                const publicShowtimes: any[] = [];
                for (let showtime of showtimes) {
                    publicShowtimes.push({
                        startTime: showtime.startTime,
                        hallType: showtime.hallType,
                    });
                }
                const successMessage: SuccessMessageI = {
                    type: "success",
                    message: "Showtimes for specific movie fetched successfully",
                    data: { page, limit, movie: publicMovie, showtimes: publicShowtimes },
                    code: 200,
                };
                return res.status(successMessage.code).send(successMessage);
            } else {
                const errorMessage: ErrorMessageI = {
                    type: "error",
                    message: "Movie not found",
                    code: 404,
                };
                return res.status(errorMessage.code).send(errorMessage);
            }
        } catch (error) {
            next(error);
        }
    }
}

export default MoviesController;
