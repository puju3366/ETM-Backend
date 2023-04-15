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
exports.RoleController = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const roleUtils_1 = require("./roleUtils");
const roleSchema_1 = require("./roleSchema");
const commonMessage_1 = require("../../../helpers/commonMessage");
class RoleController {
    constructor() {
        this.roleUtils = new roleUtils_1.RoleUtils();
        /**
         * @method Create
         * @description : Create Role.
         * @param req
         * @param res
         */
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const mydata = req.body;
            const roleData = yield this.roleUtils.createRole(mydata);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(roleData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        /**
         * @method getAll
         * @description : Get all the role details for listing.
         * @param req
         * @param res
         */
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const roleData = yield this.roleUtils.getAllRoles(req);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(roleData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        /**
        * @method getRoleById
        * @description : Get role details by Role id.
        * @param req
        * @param res
        */
        this.getRoleById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.roleUtils.getById(req);
                if (Object.entries(result).length === 0) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                }
                else {
                    const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
                    res.status(response.status_code).json(response);
                }
            }
            catch (e) {
                e.message = 'not found';
                res.status(404).send({ e, error: e.message, status: 404 });
            }
        });
        /**
         * @method delete
         * @description : delete role.
         * @param req
         * @param res
         */
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = yield roleSchema_1.Role.updateOne({ _id: id }, { status: 2 });
            const resp = {
                success: 'Role deleted sucessfully'
            };
            const response = responseBuilder_1.ResponseBuilder.respSuccess(resp, req.t("SUCCESS"));
            if (response) {
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
        });
        /**
          * @method update
          * @description : update role.
          * @param req
          * @param res
          */
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const rolesData = yield this.roleUtils.updateRoleData(req);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(rolesData, req.t("SUCCESS"));
            if (response) {
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
        });
    }
}
exports.RoleController = RoleController;
//# sourceMappingURL=roleController.js.map