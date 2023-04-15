 // Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { PlatformController } from "./platformController";
import { PlatformUpdateModel } from "./platformModel";
//import { RoleMiddleware } from "./roleMiddleware";

import {
    PlatformModel,

} from "./platformModel";
import { PlatformMiddleware } from "./platformMiddleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const platfromController = new PlatformController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new PlatformMiddleware();

router.post("/create", middleware.checktoken, v.validate(PlatformModel), platfromController.create);
router.patch("/edit/:id",  middleware.checktoken, v.validate(PlatformUpdateModel), platfromController.edit);
router.delete("/delete/:id", middleware.checktoken, platfromController.delete);
router.get("/getall", middleware.checktoken, platfromController.getAll);
router.get("/getbyid/:id", middleware.checktoken, platfromController.getById);



// Export the express.Router() instance to be used by server.ts
export const PlatformRoute: Router = router;