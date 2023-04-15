"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const mongoose_1 = require("mongoose");
const tables_1 = require("../../../config/tables");
const commonMessage_1 = require("../../../helpers/commonMessage");
const PlatformSchema = new mongoose_1.Schema({
    'platform': {
        type: String,
        required: [true, commonMessage_1.MessageModule.required('required', 'platform')],
    },
}, {
    timestamps: true,
    autoCreate: true,
});
exports.Platform = mongoose_1.model(tables_1.Tables.PLATFORM, PlatformSchema);
//# sourceMappingURL=platformSchema.js.map