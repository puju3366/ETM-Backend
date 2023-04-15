"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleUtils = void 0;
const mongoose_1 = require("mongoose");
const roleSchema_1 = require("../roles/roleSchema");
class RoleUtils {
    // Create User
    createRole(userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const role = new roleSchema_1.Role(userDetail);
            return yield role.save();
        });
    }
    getAllRoles(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield roleSchema_1.Role.find({ status: { $in: [1, 0] } }).sort({ 'createdAt': -1 });
        });
    }
    // get role by name
    getRoleByName(rolename) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield roleSchema_1.Role.findOne({ rolename });
        });
    }
    getById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        '_id': mongoose_1.Types.ObjectId(req.params.id),
                    },
                },
            ];
            return yield roleSchema_1.Role.aggregate(reqArr).exec();
        });
    }
    updateRoleData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.updated_date = new Date();
            return yield roleSchema_1.Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        });
    }
}
exports.RoleUtils = RoleUtils;
//# sourceMappingURL=roleUtils.js.map