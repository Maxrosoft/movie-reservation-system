import { Router } from "express";
import AdminController from "../controllers/adminController";
import authenticateAdminToken from "../middlewares/authenticateAdminToken";

const adminRouter: Router = Router();
const adminController: AdminController = new AdminController();

adminRouter.get("/reservations", authenticateAdminToken as any, adminController.getAllReservations as any);
adminRouter.get("/reports", authenticateAdminToken as any, adminController.getReports as any);

export default adminRouter;
