 import { Document, model, Schema } from "mongoose";
import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";
import * as validate from 'mongoose-validator';
const DashboardSchema = new Schema({

    'training_id': {
        type: String,
    },
    
    'emp_id': {
        type: String,
    },
    
});

export const Dashboard = model(Tables.DASHBOARD, DashboardSchema);