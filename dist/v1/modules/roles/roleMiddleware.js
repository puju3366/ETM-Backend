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
exports.RoleMiddleware = void 0;
const roleSchema_1 = require("../roles/roleSchema");
const constants_1 = require("../../../config/constants");
class RoleMiddleware {
    constructor() {
        this.checkNameExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let role = [];
            if (req.body.rolename) {
                role = yield roleSchema_1.Role.find({ rolename: req.body.rolename });
            }
            if (role.length > 0) {
                const resArr = {
                    "items": [],
                    "status": 0,
                    "status_code": 200,
                    "message": {
                        "rolename": req.t("ERR_ROLE_ALREADY_EXISTS")
                    }
                };
                res.status(constants_1.Constants.NOT_FOUND).json(resArr);
            }
            else {
                next();
            }
        });
        this.checkNameExistsedit = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let role = [];
            if (req.body.rolename && req.params.id) {
                role = yield roleSchema_1.Role.find({ $and: [{ $or: [{ rolename: req.body.rolename }] }, { _id: { $ne: req.params.id } }] });
            }
            if (role.length > 0) {
                const resArr = {
                    "items": [],
                    "status": 0,
                    "status_code": 200,
                    "message": {
                        "rolename": req.t("ERR_ROLE_ALREADY_EXISTS")
                    }
                };
                res.status(constants_1.Constants.NOT_FOUND).json(resArr);
            }
            else {
                next();
            }
        });
    }
}
exports.RoleMiddleware = RoleMiddleware;
//# sourceMappingURL=roleMiddleware.js.map