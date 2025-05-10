import { Router } from "express";
import ReservationsController from "../controllers/reservationsController";
import authenticateToken from "../middlewares/authenticateToken";

const reservationsRouter: Router = Router();
const reservationsController: ReservationsController = new ReservationsController();

reservationsRouter.post("/", authenticateToken as any, reservationsController.book as any);
reservationsRouter.delete("/:reservationId", authenticateToken as any, reservationsController.cancel as any);
reservationsRouter.get("/my", authenticateToken as any, reservationsController.getUsersReservations as any);

export default reservationsRouter;
