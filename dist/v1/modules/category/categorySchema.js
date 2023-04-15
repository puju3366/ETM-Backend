"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const CategorySchema = new mongoose_1.Schema({
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
exports.Category = mongoose_1.model(tables_1.Tables.CATEGORYS, CategorySchema);
//# sourceMappingURL=categorySchema.js.map