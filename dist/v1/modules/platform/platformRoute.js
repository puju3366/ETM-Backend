"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const platformController_1 = require("./platformController");
const platformModel_1 = require("./platformModel");
//import { RoleMiddleware } from "./roleMiddleware";
const platformModel_2 = require("./platformModel");
const platformMiddleware_1 = require("./platformMiddleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const platfromController = new platformController_1.PlatformController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new platformMiddleware_1.PlatformMiddleware();
router.post("/create", middleware.checktoken, v.validate(platformModel_2.PlatformModel), platfromController.create);
router.patch("/edit/:id", middleware.checktoken, v.validate(platformModel_1.PlatformUpdateModel), platfromController.edit);
router.delete("/delete/:id", middleware.checktoken, platfromController.delete);
router.get("/getall", middleware.checktoken, platfromController.getAll);
router.get("/getbyid/:id", middleware.checktoken, platfromController.getById);
// Export the express.Router() instance to be used by server.ts
exports.PlatformRoute = router;
//# sourceMappingURL=platformRoute.js.map