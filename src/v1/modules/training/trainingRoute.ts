// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { TrainingController } from "./trainingController";
import { TrainingMiddleware} from './trainingMiddleware';
//import { RoleMiddleware } from "./roleMiddleware";

import {
    TrainingModel,

} from "./trainingModel";
import { Middleware } from "../../../middleware";

// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const trainingController = new TrainingController();
//const roleMiddleware = new RoleMiddleware();
const middleware = new TrainingMiddleware();

// authorization route
router.post("/create", v.validate(TrainingModel), middleware.checktoken, trainingController.create);
// admin route
router.get("/getTraining/:id", middleware.checktoken, trainingController.getTrainingById);
router.patch("/editOlpTraining/:id", v.validate(TrainingModel), middleware.checktoken, trainingController.edit);
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
export const TrainingRoute: Router = router;