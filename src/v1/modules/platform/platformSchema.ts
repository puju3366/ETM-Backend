 import { Document, model, Schema } from "mongoose";
import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";
import * as validate from 'mongoose-validator';
const PlatformSchema = new Schema({

    'platform': {
        type: String,
        required: [true, MessageModule.required('required', 'platform')],
    },    
}, {
    timestamps: true,
    autoCreate: true,
});

export const Platform = model(Tables.PLATFORM, PlatformSchema);