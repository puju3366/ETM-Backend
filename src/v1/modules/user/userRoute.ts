// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { UserController } from "./userController";
import { UserMiddleware } from "./userMiddleware";

import {
    UserModel, LoginModel,
    ForgotPasswordModel, ResetPasswordModel, ChangePasswordModel

} from "./userModel";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const userController = new UserController();
const userMiddleware = new UserMiddleware();
const middleware = new Middleware();

// authorization route
router.post("/sign-up", v.validate(UserModel), userController.signup);
router.post("/verify", userController.verify);
router.post("/login", v.validate(LoginModel), userMiddleware.IsUserExists, userController.login);
router.post("/assign-role", userController.assignRole)
router.post("/fetchRoleAndPermissions", userController.fetchRolesAndPermissions)
router.get("/userProfile/:id", middleware.checktoken, userController.userProfile);
router.put("/", v.validate(ForgotPasswordModel), middleware.checktoken, userController.updateuserData);
router.post("/changepassword", v.validate(ChangePasswordModel), middleware.checktoken, userController.changepassword);
router.post("/forgotpassword", userController.forgotPassword);
router.post("/resetPassword", v.validate(ResetPasswordModel), userController.resetPassword);
router.get("/employees", middleware.checktoken, userController.getEmployees)
router.post("/employee", middleware.checktoken, userController.getEmployee)
router.get("/userbyId/:id", middleware.checktoken, userController.getuser)
router.get("/import", userController.import);
router.get("/backend-progress", userController.backendprogress);
router.get("/sendtopm", userController.sendtopm);
router.get("/trainingprogress", userController.trainingprogress);
// Export the express.Router() instance to be used by server.ts
export const UserRoute: Router = router;