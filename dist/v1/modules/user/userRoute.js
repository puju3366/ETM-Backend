"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const userController_1 = require("./userController");
const userMiddleware_1 = require("./userMiddleware");
const userModel_1 = require("./userModel");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const userController = new userController_1.UserController();
const userMiddleware = new userMiddleware_1.UserMiddleware();
const middleware = new middleware_1.Middleware();
// authorization route
router.post("/sign-up", v.validate(userModel_1.UserModel), userController.signup);
router.post("/verify", userController.verify);
router.post("/login", v.validate(userModel_1.LoginModel), userMiddleware.IsUserExists, userController.login);
router.post("/assign-role", userController.assignRole);
router.post("/fetchRoleAndPermissions", userController.fetchRolesAndPermissions);
router.get("/userProfile/:id", middleware.checktoken, userController.userProfile);
router.put("/", v.validate(userModel_1.ForgotPasswordModel), middleware.checktoken, userController.updateuserData);
router.post("/changepassword", v.validate(userModel_1.ChangePasswordModel), middleware.checktoken, userController.changepassword);
router.post("/forgotpassword", userController.forgotPassword);
router.post("/resetPassword", v.validate(userModel_1.ResetPasswordModel), userController.resetPassword);
router.get("/employees", middleware.checktoken, userController.getEmployees);
router.post("/employee", middleware.checktoken, userController.getEmployee);
router.get("/userbyId/:id", middleware.checktoken, userController.getuser);
router.get("/import", userController.import);
router.get("/backend-progress", userController.backendprogress);
router.get("/sendtopm", userController.sendtopm);
router.get("/trainingprogress", userController.trainingprogress);
// Export the express.Router() instance to be used by server.ts
exports.UserRoute = router;
//# sourceMappingURL=userRoute.js.map