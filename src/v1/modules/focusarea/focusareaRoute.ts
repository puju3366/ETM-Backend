 // Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { FocusAreaController } from "./focusareaController";
import { FocusareaUpdateModel } from "./focusareaModel";
//import { RoleMiddleware } from "./roleMiddleware";

import {
    FocusareaModel,

} from "./focusareaModel";
import { FocusareaMiddleware } from "./focusareaMiddleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const focusareaController = new FocusAreaController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new FocusareaMiddleware();

router.post("/create", middleware.checktoken, v.validate(FocusareaModel), focusareaController.create);
router.patch("/edit/:id",  middleware.checktoken, v.validate(FocusareaUpdateModel), focusareaController.edit);
router.delete("/delete/:id", middleware.checktoken, focusareaController.delete);
router.get("/getall", middleware.checktoken, focusareaController.getAll);
router.get("/getbyid/:id", middleware.checktoken, focusareaController.getById);



// Export the express.Router() instance to be used by server.ts
export const FocusareaRoute: Router = router;