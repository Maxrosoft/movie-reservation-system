import { Router } from "express";
import ShowtimesController from "../controllers/showtimesController";
import authenticateAdminToken from "../middlewares/authenticateAdminToken";
import authenticateToken from "../middlewares/authenticateToken";

const showtimesRouter: Router = Router();
const showtimesController: ShowtimesController = new ShowtimesController();

showtimesRouter.post("/", authenticateAdminToken as any, showtimesController.addOne as any);
showtimesRouter.get("/", authenticateToken as any, showtimesController.fetchAll as any);
showtimesRouter.get("/:showtimeId", authenticateToken as any, showtimesController.fetchOne as any);
showtimesRouter.put("/:showtimeId", authenticateAdminToken as any, showtimesController.changeOneCompletely as any);
showtimesRouter.patch("/:showtimeId", authenticateAdminToken as any, showtimesController.changeOnePartly as any);
showtimesRouter.delete("/:showtimeId", authenticateAdminToken as any, showtimesController.removeOne as any);
showtimesRouter.get("/:showtimeId/seats", authenticateToken as any, showtimesController.getSeats as any);

export default showtimesRouter;
