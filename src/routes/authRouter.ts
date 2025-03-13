import { Router } from "express";
import AuthController from "../controllers/authController";

const authRouter: Router = Router();
const authController: AuthController = new AuthController();

authRouter.post("/register", authController.register);

export default authRouter;
