import { Document, model, Schema } from "mongoose";
import { Tables } from '../../../config/tables';
import { MessageModule } from "../../../helpers/commonMessage";
import * as validate from 'mongoose-validator';
const UserSchema = new Schema({
    'firstname': {
        type: String,
        required: [true, MessageModule.required('required', 'firstname')],
        trim: true,
    },
    'lastname': {
        type: String,
        // required: [true, MessageModule.required('required', 'lastname')],
        trim: true,
        default: null,
    },
    'email': {
        type: String,
        trim: true,
        validate: [validate({
            validator: (value: any) => {
                return model(Tables.USERS).count({ email: value }).exec()
                    .then((count) => {
                        if (count > 0) return false;
                        if (count === 0) return true;
                    })
                    .catch((err) => {
                        return false;
                    });
            },
            message: MessageModule.required('email_exist', 'email'),
        })],
    },
    'password': {
        type: String,
    },
    'userTypeCode': {
        type: Number,
        required: [true, MessageModule.required('required', 'userTypeCode')],
    },
    'emailconfirmed': {
        type: Boolean,
        default: false,
    },
    'phone': {
        type: String,
        trim: true,
        /* validate: [validate({
            validator: (value: any) => {
                return model(Tables.USERS).count({ phone: value }).exec()
                    .then((count) => {
                        if (count > 0) return false;
                        if (count === 0) return true;
                    })
                    .catch((err) => {
                        return false;
                    });
            },
            message: MessageModule.required('phone_exist', 'phone'),
        })], */

    },
    'reporting_manager': {
        type: Schema.Types.ObjectId,
        ref: 'users',
        default: null,
    },
    'userrole': {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },
    'userband': {
        type: String
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
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    userTypeCode:number;    
    status: number,
    emailconfirmed:boolean,
    phone:string,         
    created_by: string;
    updated_by: string;   
}
export const User = model<Users>(Tables.USERS, UserSchema);