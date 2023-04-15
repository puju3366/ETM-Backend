"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleRoute = void 0;
// Import only what we need from express
const express_1 = require("express");
const validate_1 = require("../../../validate");
const roleController_1 = require("./roleController");
const roleMiddleware_1 = require("./roleMiddleware");
const roleModel_1 = require("./roleModel");
const middleware_1 = require("../../../middleware");
// Assign router to the express.Router() instance
const router = express_1.Router();
const v = new validate_1.Validator();
const roleController = new roleController_1.RoleController();
const roleMiddleware = new roleMiddleware_1.RoleMiddleware();
const middleware = new middleware_1.Middleware();
router.post("/create", v.validate(roleModel_1.RoleModel), roleMiddleware.checkNameExists, roleController.create);
router.get("/", middleware.checktoken, roleController.getAll);
router.get("/getRole/:id", middleware.checktoken, roleController.getRoleById);
router.patch("/editRole/:id", v.validate(roleModel_1.RoleModel), middleware.checktoken, roleMiddleware.checkNameExistsedit, roleController.update);
router.delete("/delete/:id", middleware.checktoken, roleController.delete);
// Export the express.Router() instance to be used by server.ts
exports.RoleRoute = router;
//# sourceMappingURL=RoleRoute.js.map