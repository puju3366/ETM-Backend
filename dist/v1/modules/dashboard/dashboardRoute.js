"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const dashboardController_1 = require("./dashboardController");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const dashboardController = new dashboardController_1.DashboardController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new middleware_1.Middleware();
// authorization route
router.get("/getTraningName/:id", middleware.checktoken, dashboardController.getTraningName);
router.get("/gettrainingprogress/:id", dashboardController.getTraningProgress);
router.get("/dashboard/:id", middleware.checktoken, dashboardController.dashboard);
router.post("/videos", middleware.checktoken, dashboardController.getTotalvideos);
router.get("/graph", middleware.checktoken, dashboardController.graph);
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
exports.DashboardRoute = router;
//# sourceMappingURL=dashboardRoute.js.map