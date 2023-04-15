import express = require("express");
import * as l10n from "jm-ez-l10n";
import { UserRoute } from "./v1/modules/user/userRoute";
import { LocationRoute } from "./v1/modules/location/locationRoute";
import { CategoryRoute } from "./v1/modules/category/categoryRoute";
import { RoleRoute } from "./v1/modules/roles/roleRoute";
import { TrainingRoute } from "./v1/modules/training/trainingRoute";
import { DashboardRoute } from "./v1/modules/dashboard/dashboardRoute";
import { TrainingEmpRoute } from "./v1//modules/trainingemployee/trainingempRoute";
import { PlatformRoute } from "./v1/modules/platform/platformRoute";
import { FocusareaRoute } from "./v1/modules/focusarea/focusareaRoute";
import { ProgressRoute } from "./v1/modules/addprogress/progressRoute";
import { TimelineRoute } from "./v1/modules/timeline/timelineRoute";
import { RightsRoute } from "./v1/modules/rights/rightsRoutes";



export class Routes {
  protected basePath: string;

  constructor(NODE_ENV: string) {
    switch (NODE_ENV) {
      case "production":
        this.basePath = "/app/dist";
        break;
      case "development":
        this.basePath = "/app/public";
        break;
    }
  }

  public defaultRoute(req: express.Request, res: express.Response) {
    res.json({
      message: "Hello !",
    });
  }

  public path() {
    const router = express.Router();
    router.use("/users", UserRoute);
    router.use("/locations", LocationRoute);
    router.use("/category", CategoryRoute);
    router.use("/roles", RoleRoute);
    router.use("/training", TrainingRoute);
    router.use("/dashbaord", DashboardRoute);
    router.use("/trainingemp", TrainingEmpRoute);
    router.use("/platform", PlatformRoute);
    router.use("/focusarea", FocusareaRoute);
    router.use("/progress", ProgressRoute);
    router.use("/timeline", TimelineRoute);
    router.use("/rights", RightsRoute);



    router.all("/*", (req, res) => {
      return res.status(404).json({ error: l10n.t("ERR_URL_NOT_FOUND") });
    });
    return router;
  }
}
