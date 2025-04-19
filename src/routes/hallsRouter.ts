import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken";
import authenticateAdminToken from "../middlewares/authenticateAdminToken";
import HallsController from "../controllers/hallsController";

const hallsRouter: Router = Router();
const hallsController: HallsController = new HallsController();

hallsRouter.post("/", authenticateAdminToken as any, hallsController.addOne as any);
hallsRouter.get("/", authenticateToken as any, hallsController.fetchAll as any);
hallsRouter.get("/:hallId", authenticateToken as any, hallsController.fetchOne as any);
hallsRouter.put("/:hallId", authenticateAdminToken as any, hallsController.changeOneCompletely as any);
hallsRouter.patch("/:hallId", authenticateAdminToken as any, hallsController.changeOnePartly as any);
hallsRouter.delete("/:hallId", authenticateAdminToken as any, hallsController.removeOne as any);

export default hallsRouter;
