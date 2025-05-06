import { Router } from "express";
import MoviesController from "../controllers/moviesController";
import authenticateAdminToken from "../middlewares/authenticateAdminToken";
import authenticateToken from "../middlewares/authenticateToken";

const moviesRouter: Router = Router();
const moviesController: MoviesController = new MoviesController();

moviesRouter.post("/", authenticateAdminToken as any, moviesController.addOne as any);
moviesRouter.get("/", authenticateAdminToken as any, moviesController.fetchAll as any);
moviesRouter.get("/:movieId", authenticateAdminToken as any, moviesController.fetchOne as any);
moviesRouter.put("/:movieId", authenticateAdminToken as any, moviesController.changeOneCompletely as any);
moviesRouter.patch("/:movieId", authenticateAdminToken as any, moviesController.changeOnePartly as any);
moviesRouter.delete("/:movieId", authenticateAdminToken as any, moviesController.removeOne as any);
moviesRouter.get("/:movieId/showtimes", authenticateToken as any, moviesController.getShowtimes as any);

export default moviesRouter;
