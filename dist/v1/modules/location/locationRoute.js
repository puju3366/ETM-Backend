"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const locationController_1 = require("./locationController");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const locationController = new locationController_1.LocationController();
// location route
router.get("/", locationController.getAll);
// Export the express.Router() instance to be used by server.ts
exports.LocationRoute = router;
//# sourceMappingURL=locationRoute.js.map