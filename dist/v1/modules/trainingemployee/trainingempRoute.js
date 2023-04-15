"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingEmpRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const trainingempController_1 = require("./trainingempController");
const trainingempMiddleware_1 = require("./trainingempMiddleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const trainingEmpController = new trainingempController_1.TrainingEmpController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new trainingempMiddleware_1.TrainingEmpMiddleware();
// authorization route
// router.post("/create", v.validate(TrainingModel), trainingController.create);
router.post('/linkemployee', middleware.checktoken, trainingEmpController.linkEmployee);
router.post('/getemployee', middleware.checktoken, trainingEmpController.getEmployee);
router.post('/getemployeeall', middleware.checktoken, trainingEmpController.getEmployeeall);
router.post('/deleteemployee', middleware.checktoken, trainingEmpController.deleteEmployee);
router.post('/notifyparticipants', middleware.checktoken, trainingEmpController.notifyParticipants);
router.get('/dashboard', middleware.checktoken, trainingEmpController.Dashboard);
router.get('/dashboard', middleware.checktoken, trainingEmpController.Dashboard);
router.post('/trainingempdata', middleware.checktoken, trainingEmpController.progressDataByTrainingemp);
// router.get('/getuser/:id',  middleware.checktoken,trainingEmpController.getUsersById);
// admin route
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
exports.TrainingEmpRoute = router;
//# sourceMappingURL=trainingempRoute.js.map