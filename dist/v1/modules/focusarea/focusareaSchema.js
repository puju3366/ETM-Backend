"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Focusarea = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const commonMessage_1 = require("../../../helpers/commonMessage");
const FocusareaSchema = new mongoose_1.Schema({
    'focus_area': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'focus_area')],
    },
}, {
    timestamps: true,
    autoCreate: true,
});
exports.Focusarea = mongoose_1.model(tables_1.Tables.FOCUSAREA, FocusareaSchema);
//# sourceMappingURL=focusareaSchema.js.map