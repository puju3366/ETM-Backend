"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingEmp = void 0;
const mongoose_1 = require("mongoose");
var mongoose = require('mongoose');
const tables_1 = require("../../../config/tables");
const commonMessage_1 = require("../../../helpers/commonMessage");
const TrainingEmpSchema = new mongoose_1.Schema({
    'training_id': {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, commonMessage_1.MessageModule.required('required', 'training_id')],
    },
    'emp_id': [{
            type: mongoose_1.Schema.Types.ObjectId,
            required: [true, commonMessage_1.MessageModule.required('required', 'emp_id')],
        }],
}, {
    timestamps: true,
    autoCreate: true,
});
exports.TrainingEmp = mongoose_1.model(tables_1.Tables.TRAININGEMP, TrainingEmpSchema);
//# sourceMappingURL=trainingempSchema.js.map