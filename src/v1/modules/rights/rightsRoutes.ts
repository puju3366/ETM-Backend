import { Router } from "express";
import { RightsController } from "./rightsController";
import { Middleware } from "../../../middleware";
import { Validator } from "../../../validate";
import {
    RightModel,
} from "./rightsModel";

const rightsController = new RightsController();
const middleware = new Middleware();
const v: Validator = new Validator();
const router: Router = Router();

router.post("/create", v.validate(RightModel), middleware.checktoken, rightsController.create);
router.get("/", middleware.checktoken, rightsController.getAll)
router.get("/modules", middleware.checktoken, rightsController.getAllModule)
router.get("/:id", middleware.checktoken, rightsController.getRightById);
router.delete("/delete/:id", middleware.checktoken, rightsController.delete);
router.patch("/edit/:id", v.validate(RightModel), middleware.checktoken, rightsController.update);


export const RightsRoute: Router = router;
