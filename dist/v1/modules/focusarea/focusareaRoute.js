"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusareaRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const focusareaController_1 = require("./focusareaController");
const focusareaModel_1 = require("./focusareaModel");
//import { RoleMiddleware } from "./roleMiddleware";
const focusareaModel_2 = require("./focusareaModel");
const focusareaMiddleware_1 = require("./focusareaMiddleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const focusareaController = new focusareaController_1.FocusAreaController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new focusareaMiddleware_1.FocusareaMiddleware();
router.post("/create", middleware.checktoken, v.validate(focusareaModel_2.FocusareaModel), focusareaController.create);
router.patch("/edit/:id", middleware.checktoken, v.validate(focusareaModel_1.FocusareaUpdateModel), focusareaController.edit);
router.delete("/delete/:id", middleware.checktoken, focusareaController.delete);
router.get("/getall", middleware.checktoken, focusareaController.getAll);
router.get("/getbyid/:id", middleware.checktoken, focusareaController.getById);
// Export the express.Router() instance to be used by server.ts
exports.FocusareaRoute = router;
//# sourceMappingURL=focusareaRoute.js.map