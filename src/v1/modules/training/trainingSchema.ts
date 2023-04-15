import { Document, model, Schema } from "mongoose";
import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";
import * as validate from 'mongoose-validator';
const TrainingSchema = new Schema({
    'trainingname': {
        type: String,
        required: [true, MessageModule.required('required', 'trainingname')],
        trim: true,
    },
    'platform': {
        type: String,
        required: [true, MessageModule.required('required', 'platform')],
        trim: true,
    },
	'courselink': {
        type: String,
        required: [true, MessageModule.required('required', 'courselink')],
        trim: true,
    },
	'focus_area': {
        type: String,
        required: [true, MessageModule.required('required', 'focus_area')],
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
        type: Schema.Types.ObjectId,
        required: [true, MessageModule.required('required', 'mentor')],
    
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
interface Training extends Document {

    trainingname: string;
	platform: string;
	courselink: string;
	focus_area: string;
	level: number;
	no_of_video: string;
	startdate: string;
	endate: string;
	status: number,
    isactive: number;
    created_by: string;
    updated_by: string;   
}
export const Training = model<Training>(Tables.TRAINING, TrainingSchema);