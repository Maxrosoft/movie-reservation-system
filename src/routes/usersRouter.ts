import { Router } from "express";
import UsersController from "../controllers/usersController";
import authenticateAdminToken from "../middlewares/authenticateAdminToken";
import auuthenticateSuperAdminToken from "../middlewares/authenticateSuperAdminToken";

const usersRouter: Router = Router();
const usersController: UsersController = new UsersController();

usersRouter.put("/:userId/promote", authenticateAdminToken as any, usersController.promote as any);
usersRouter.put("/:userId/demote", auuthenticateSuperAdminToken as any, usersController.demote as any);

export default usersRouter;
