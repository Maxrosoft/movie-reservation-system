import { Router } from "express";
import AuthController from "../controllers/authController";
import authenticateToken from "../middlewares/authenticateToken";

const authRouter: Router = Router();
const authController: AuthController = new AuthController();

authRouter.post("/register", authController.register as any);
authRouter.post("/login", authController.login as any);
authRouter.get("/me", authenticateToken as any, authController.me as any);
authRouter.post("/logout", authenticateToken as any, authController.logout as any);
authRouter.post("/refresh-token", authenticateToken as any, authController.refresh as any);
authRouter.post("/change-password", authenticateToken as any, authController.changePassword as any);
authRouter.post("/forgot-password", authenticateToken as any, authController.forgotPassword as any);
authRouter.post("/reset-password", authenticateToken as any, authController.resetPassword as any);

export default authRouter;
