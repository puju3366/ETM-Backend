import { Document, model, Schema } from "mongoose";
var mongoose = require('mongoose');

import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";

import * as validate from 'mongoose-validator';


const TimelineSchema = new Schema({
    'action' : {
        type: String
    },
    'emp_id': {
        type: Schema.Types.ObjectId,
        required: [true, MessageModule.required('required', 'emp_id')],
    
      },
      'training_id': {
        type: Schema.Types.ObjectId,    
      },
}, {
    timestamps: true,
    autoCreate: true,
});

export const Timeline = model(Tables.TIMELINE, TimelineSchema);