"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelineRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const timelineController_1 = require("./timelineController");
//import { RoleMiddleware } from "./roleMiddleware";
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const timelineController = new timelineController_1.TimelineController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new middleware_1.Middleware();
// authorization route
router.get("/timeline/:id", middleware.checktoken, timelineController.timeline);
exports.TimelineRoute = router;
//# sourceMappingURL=timelineRoute.js.map