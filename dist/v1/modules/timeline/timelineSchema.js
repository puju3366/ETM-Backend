"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Timeline = void 0;
const mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
const tables_1 = require("../../../config/tables");
const commonMessage_1 = require("../../../helpers/commonMessage");
const TimelineSchema = new mongoose_1.Schema({
    'action': {
        type: String
    },
    'emp_id': {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, commonMessage_1.MessageModule.required('required', 'emp_id')],
    },
    'training_id': {
        type: mongoose_1.Schema.Types.ObjectId,
    },
}, {
    timestamps: true,
    autoCreate: true,
});
exports.Timeline = mongoose_1.model(tables_1.Tables.TIMELINE, TimelineSchema);
//# sourceMappingURL=timelineSchema.js.map