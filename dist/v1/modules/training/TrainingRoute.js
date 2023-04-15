"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const trainingController_1 = require("./trainingController");
const trainingMiddleware_1 = require("./trainingMiddleware");
//import { RoleMiddleware } from "./roleMiddleware";
const trainingModel_1 = require("./trainingModel");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const trainingController = new trainingController_1.TrainingController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new trainingMiddleware_1.TrainingMiddleware();
// authorization route
router.post("/create", v.validate(trainingModel_1.TrainingModel), middleware.checktoken, trainingController.create);
// admin route
router.get("/getTraining/:id", middleware.checktoken, trainingController.getTrainingById);
router.patch("/editOlpTraining/:id", v.validate(trainingModel_1.TrainingModel), middleware.checktoken, trainingController.edit);
router.delete("/delete/:id", middleware.checktoken, trainingController.delete);
router.get("/", middleware.checktoken, trainingController.getAll);
/*
router.post("/verify", userController.verify);
router.post("/login", v.validate(LoginModel), userMiddleware.IsUserExists, userController.login);
router.get("/userProfile/:id", middleware.checktoken, userController.userProfile);
router.put("/", v.validate(ForgotPasswordModel), middleware.checktoken, userController.updateuserData);
router.post("/changepassword", v.validate(ChangePasswordModel), middleware.checktoken, userController.changepassword);
router.post("/forgotpassword", userController.forgotPassword);
router.post("/resetPassword", v.validate(ResetPasswordModel), userController.resetPassword);
*/
// Export the express.Router() instance to be used by server.ts
exports.TrainingRoute = router;
//# sourceMappingURL=TrainingRoute.js.map