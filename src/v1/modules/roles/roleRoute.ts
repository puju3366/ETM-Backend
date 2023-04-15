// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { RoleController } from "./roleController";
import { RoleMiddleware } from "./roleMiddleware";

import {
    RoleModel,

} from "./roleModel";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const roleController = new RoleController();
const roleMiddleware = new RoleMiddleware();
const middleware = new Middleware();


router.post("/create", v.validate(RoleModel), roleMiddleware.checkNameExists, roleController.create);
router.get("/", middleware.checktoken, roleController.getAll);
router.get("/getRole/:id", middleware.checktoken, roleController.getRoleById);
router.patch("/editRole/:id", v.validate(RoleModel), middleware.checktoken, roleMiddleware.checkNameExistsedit, roleController.update);
router.delete("/delete/:id", middleware.checktoken, roleController.delete);
// Export the express.Router() instance to be used by server.ts
export const RoleRoute: Router = router;