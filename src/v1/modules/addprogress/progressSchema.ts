 import { Document, model, Schema } from "mongoose";
import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";
import * as validate from 'mongoose-validator';
const ProgressSchema = new Schema({

    'training_id': {
        type: Schema.Types.ObjectId,
        required: [true, MessageModule.required('required', 'training_id')],
    },
    
    'emp_id': {
        type: Schema.Types.ObjectId,
        required: [true, MessageModule.required('required', 'emp_id')],

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


export const Progress = model(Tables.TRAININGPROGRESS, ProgressSchema);