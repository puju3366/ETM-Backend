import { Document, model, Schema } from "mongoose";
import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";
import * as validate from 'mongoose-validator';
const CategorySchema = new Schema({
    'name': {
        type: String,
    },
    'status': {
        type: Number,
        default: 1,
    },
    'created_by': {
        type: String,
    },
    'updated_by': {
        type: String,
    }
}, {
    timestamps: true,
    autoCreate: true,
});
interface Categorys extends Document {
    name: string;
    status: number,
    created_by: string;
    updated_by: string;
}
export const Category = model<Categorys>(Tables.CATEGORYS, CategorySchema);