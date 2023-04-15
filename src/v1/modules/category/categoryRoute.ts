// Import only what we need from express
import { Router } from "express";
import { Validator } from "../../../validate";
import { CategoryController } from "./categoryController";
import { CategoryModel } from "./categoryModel";


// Assign router to the express.Router() instance
const router: Router = Router();
const v: Validator = new Validator();
const categoryController = new CategoryController();


// location route
router.get("/", categoryController.getAll);

// Export the express.Router() instance to be used by server.ts
export const CategoryRoute: Router = router;