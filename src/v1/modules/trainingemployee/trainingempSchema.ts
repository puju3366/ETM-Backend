import { Document, model, Schema } from "mongoose";
var mongoose = require('mongoose');

import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";

import * as validate from 'mongoose-validator';


const TrainingEmpSchema = new Schema({
    'training_id': {
        type: Schema.Types.ObjectId,
        required: [true, MessageModule.required('required', 'training_id')],
    },
    'emp_id': [{
        type: Schema.Types.ObjectId,
        required: [true, MessageModule.required('required', 'emp_id')],
    
      }],
}, {
    timestamps: true,
    autoCreate: true,
});

export const TrainingEmp = model(Tables.TRAININGEMP, TrainingEmpSchema);