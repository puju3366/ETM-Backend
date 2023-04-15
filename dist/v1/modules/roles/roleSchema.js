"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const commonMessage_1 = require("../../../helpers/commonMessage");
const RoleSchema = new mongoose_1.Schema({
    'rolename': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'rolename')],
        trim: true,
    },
    'isactive': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'isactive')],
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
exports.Role = mongoose_1.model(tables_1.Tables.ROLES, RoleSchema);
//# sourceMappingURL=roleSchema.js.map