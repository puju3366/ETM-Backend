"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express = require("express");
const l10n = require("jm-ez-l10n");
const userRoute_1 = require("./v1/modules/user/userRoute");
const locationRoute_1 = require("./v1/modules/location/locationRoute");
const categoryRoute_1 = require("./v1/modules/category/categoryRoute");
const roleRoute_1 = require("./v1/modules/roles/roleRoute");
const trainingRoute_1 = require("./v1/modules/training/trainingRoute");
const dashboardRoute_1 = require("./v1/modules/dashboard/dashboardRoute");
const trainingempRoute_1 = require("./v1//modules/trainingemployee/trainingempRoute");
const platformRoute_1 = require("./v1/modules/platform/platformRoute");
const focusareaRoute_1 = require("./v1/modules/focusarea/focusareaRoute");
const progressRoute_1 = require("./v1/modules/addprogress/progressRoute");
const timelineRoute_1 = require("./v1/modules/timeline/timelineRoute");
const rightsRoutes_1 = require("./v1/modules/rights/rightsRoutes");
class Routes {
    constructor(NODE_ENV) {
        switch (NODE_ENV) {
            case "production":
                this.basePath = "/app/dist";
                break;
            case "development":
                this.basePath = "/app/public";
                break;
        }
    }
    defaultRoute(req, res) {
        res.json({
            message: "Hello !",
        });
    }
    path() {
        const router = express.Router();
        router.use("/users", userRoute_1.UserRoute);
        router.use("/locations", locationRoute_1.LocationRoute);
        router.use("/category", categoryRoute_1.CategoryRoute);
        router.use("/roles", roleRoute_1.RoleRoute);
        router.use("/training", trainingRoute_1.TrainingRoute);
        router.use("/dashbaord", dashboardRoute_1.DashboardRoute);
        router.use("/trainingemp", trainingempRoute_1.TrainingEmpRoute);
        router.use("/platform", platformRoute_1.PlatformRoute);
        router.use("/focusarea", focusareaRoute_1.FocusareaRoute);
        router.use("/progress", progressRoute_1.ProgressRoute);
        router.use("/timeline", timelineRoute_1.TimelineRoute);
        router.use("/rights", rightsRoutes_1.RightsRoute);
        router.all("/*", (req, res) => {
            return res.status(404).json({ error: l10n.t("ERR_URL_NOT_FOUND") });
        });
        return router;
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map