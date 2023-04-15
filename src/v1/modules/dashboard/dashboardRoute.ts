// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { DashboardController } from "./dashboardController";
//import { RoleMiddleware } from "./roleMiddleware";

import {
    DashboardModel,

} from "./dashboardModel";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const dashboardController = new DashboardController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new Middleware();

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
export const DashboardRoute: Router = router;