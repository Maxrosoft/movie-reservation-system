import { Router } from "express";
import ReservationsController from "../controllers/reservationsController";
import authenticateToken from "../middlewares/authenticateToken";

const reservationsRouter: Router = Router();
const reservationsController: ReservationsController = new ReservationsController();

reservationsRouter.post("/", authenticateToken as any, reservationsController.book as any);

export default reservationsRouter;
