import { Document, model, Schema } from "mongoose";
import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";
import * as validate from 'mongoose-validator';
const RoleSchema = new Schema({
    'rolename': {
        type: String,
        required: [true, MessageModule.required('required', 'rolename')],
        trim: true,
    },
    'isactive': {
        type: String,
        required: [true, MessageModule.required('required', 'isactive')],
        trim: true,
    },
    'rights': {
        type: Array,
        trim: true,
        default: null
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
interface Users extends Document {

    rolename: string;
    isactive: string;

    status: number,

    created_by: string;
    updated_by: string;
}
export const Role = model<Users>(Tables.ROLES, RoleSchema);