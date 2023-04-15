"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Training = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const commonMessage_1 = require("../../../helpers/commonMessage");
const TrainingSchema = new mongoose_1.Schema({
    'trainingname': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'trainingname')],
        trim: true,
    },
    'platform': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'platform')],
        trim: true,
    },
    'courselink': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'courselink')],
        trim: true,
    },
    'focus_area': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'focus_area')],
        trim: true,
    },
    'level': {
        type: String,
    },
    'no_of_video': {
        type: String,
    },
    'startdate': {
        type: String,
    },
    'endate': {
        type: String,
    },
    'mentor': [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: [true, commonMessage_1.MessageModule.required('required', 'mentor')],
        }],
    'status': {
        type: Number,
        default: 1,
    },
    'isactive': {
        type: Number,
        default: 1,
    },
    'created_by': {
        type: String,
    },
    'updated_by': {
        type: String,
    },
}, {
    timestamps: true,
    autoCreate: true,
});
exports.Training = mongoose_1.model(tables_1.Tables.TRAINING, TrainingSchema);
//# sourceMappingURL=trainingSchema.js.map