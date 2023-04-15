"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const categoryController_1 = require("./categoryController");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const categoryController = new categoryController_1.CategoryController();
// location route
router.get("/", categoryController.getAll);
// Export the express.Router() instance to be used by server.ts
exports.CategoryRoute = router;
//# sourceMappingURL=categoryRoute.js.map