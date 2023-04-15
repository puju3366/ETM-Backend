 import { Document, model, Schema } from "mongoose";
import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";
import * as validate from 'mongoose-validator';
const FocusareaSchema = new Schema({

    'focus_area': {
        type: String,
        required: [true, MessageModule.required('required', 'focus_area')],
    },    
}, {
    timestamps: true,
    autoCreate: true,
});

export const Focusarea = model(Tables.FOCUSAREA, FocusareaSchema);