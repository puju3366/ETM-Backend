"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const commonMessage_1 = require("../../../helpers/commonMessage");
const ProgressSchema = new mongoose_1.Schema({
    'training_id': {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, commonMessage_1.MessageModule.required('required', 'training_id')],
    },
    'emp_id': {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, commonMessage_1.MessageModule.required('required', 'emp_id')],
    },
    'start_week': {
        type: Date,
        required: true
    },
    'end_week': {
        type: Date,
        required: true
    },
    'completed_videos': {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
    autoCreate: true,
});
exports.Progress = mongoose_1.model(tables_1.Tables.TRAININGPROGRESS, ProgressSchema);
//# sourceMappingURL=progressSchema.js.map