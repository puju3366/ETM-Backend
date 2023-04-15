// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { ProgressController } from "./progressController";
//import { RoleMiddleware } from "./roleMiddleware";

import {
    ProgressModel,

} from "./progressModel";
import { ProgressMiddleware } from "./progressMiddleware";

const router: Router = Router();
const v: Validator = new Validator();
const progressController = new ProgressController();
const middleware = new ProgressMiddleware();

router.post("/addprogress", v.validate(ProgressModel), middleware.checktoken, progressController.addProgress);
router.post("/viewprogress", v.validate(ProgressModel), middleware.checktoken, progressController.viewProgress);
router.patch("/trainingdetails/:id", middleware.checktoken, progressController.getTrainingDetails);
router.get("/viewuserprogress/:id", middleware.checktoken, progressController.viewUserProgress);
router.get("/exportuserprogress/:id",  progressController.exportUserProgress);



export const ProgressRoute: Router = router;