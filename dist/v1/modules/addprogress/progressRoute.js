"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const progressController_1 = require("./progressController");
//import { RoleMiddleware } from "./roleMiddleware";
const progressModel_1 = require("./progressModel");
const progressMiddleware_1 = require("./progressMiddleware");
const router = express_1.Router();
const v = new validate_1.Validator();
const progressController = new progressController_1.ProgressController();
const middleware = new progressMiddleware_1.ProgressMiddleware();
router.post("/addprogress", v.validate(progressModel_1.ProgressModel), middleware.checktoken, progressController.addProgress);
router.post("/viewprogress", v.validate(progressModel_1.ProgressModel), middleware.checktoken, progressController.viewProgress);
router.patch("/trainingdetails/:id", middleware.checktoken, progressController.getTrainingDetails);
router.get("/viewuserprogress/:id", middleware.checktoken, progressController.viewUserProgress);
router.get("/exportuserprogress/:id", progressController.exportUserProgress);
exports.ProgressRoute = router;
//# sourceMappingURL=progressRoute.js.map