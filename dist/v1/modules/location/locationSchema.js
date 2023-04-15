"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const LocationSchema = new mongoose_1.Schema({
    'name': {
        type: String,
    },
    'status': {
        type: Number,
        default: 1,
    },
    'created_by': {
        type: String,
    },
    'updated_by': {
        type: String,
    }
}, {
    timestamps: true,
    autoCreate: true,
});
exports.Location = mongoose_1.model(tables_1.Tables.LOCATIONS, LocationSchema);
//# sourceMappingURL=locationSchema.js.map