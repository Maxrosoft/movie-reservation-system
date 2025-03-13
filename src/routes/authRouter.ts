import { Router } from "express";
import AuthController from "../controllers/authController";
import authenticateToken from "../middlewares/authenticateToken";

const authRouter: Router = Router();
const authController: AuthController = new AuthController();

authRouter.post("/register", authController.register as any);
authRouter.post("/login", authController.login as any);
authRouter.get("/me", authenticateToken as any, authController.me as any);

export default authRouter;
