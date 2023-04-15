// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { TimelineController } from "./timelineController";
//import { RoleMiddleware } from "./roleMiddleware";

import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const timelineController = new TimelineController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new Middleware();

// authorization route
router.get("/timeline/:id", middleware.checktoken, timelineController.timeline);

export const TimelineRoute: Router = router;