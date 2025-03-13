import { Router } from "express";
import AuthController from "../controllers/authController";

const authRouter: Router = Router();
const authController: AuthController = new AuthController();

authRouter.post("/register", authController.register as any);
authRouter.post("/login", authController.login as any);

export default authRouter;
