"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dashboard = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const DashboardSchema = new mongoose_1.Schema({
    'training_id': {
        type: String,
    },
    'emp_id': {
        type: String,
    },
});
exports.Dashboard = mongoose_1.model(tables_1.Tables.DASHBOARD, DashboardSchema);
//# sourceMappingURL=dashboardSchema.js.map