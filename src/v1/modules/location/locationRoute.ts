// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { LocationController } from "./locationController";
import { LocationModel } from "./locationModel";


// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const locationController = new LocationController();


// location route
router.get("/", locationController.getAll);

// Export the express.Router() instance to be used by server.ts
export const LocationRoute: Router = router;