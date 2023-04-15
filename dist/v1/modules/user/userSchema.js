"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const commonMessage_1 = require("../../../helpers/commonMessage");
const validate = require("mongoose-validator");
const UserSchema = new mongoose_1.Schema({
    'firstname': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'firstname')],
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
                validator: (value) => {
                    return mongoose_1.model(tables_1.Tables.USERS).count({ email: value }).exec()
                        .then((count) => {
                        if (count > 0)
                            return false;
                        if (count === 0)
                            return true;
                    })
                        .catch((err) => {
                        return false;
                    });
                },
                message: commonMessage_1.MessageModule.required('email_exist', 'email'),
            })],
    },
    'password': {
        type: String,
    },
    'userTypeCode': {
        type: Number,
        required: [true, commonMessage_1.MessageModule.required('required', 'userTypeCode')],
    },
    'emailconfirmed': {
        type: Boolean,
        default: false,
    },
    'phone': {
        type: String,
        trim: true,
    },
    'reporting_manager': {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        default: null,
    },
    'userrole': {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.User = mongoose_1.model(tables_1.Tables.USERS, UserSchema);
//# sourceMappingURL=userSchema.js.map