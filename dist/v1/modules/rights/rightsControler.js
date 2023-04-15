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
exports.RightsController = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const commonMessage_1 = require("../../../helpers/commonMessage");
const rightsUtils_1 = require("./rightsUtils");
const { Rights } = require('./rightsSchema');
class RightsController {
    constructor() {
        this.RightsUtils = new rightsUtils_1.RightsUtils();
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const mydata = req.body;
            const RightsCreate = yield this.RightsUtils.getRights(mydata);
            console.log("Rights", RightsCreate);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(RightsCreate, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const mydata = req.body;
            const moduleData = mydata.moduleID.split(" ");
            const slug = yield this.RightsUtils.createSlug({ rightname: mydata.name, moduledata: mydata.moduleID });
            const moduleid = moduleData.shift();
            mydata.moduleID = moduleid;
            mydata.slug = slug;
            const roleData = yield this.RightsUtils.createRight(mydata);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(roleData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        /**
        * @method delete
        * @description : delete role.
        * @param req
        * @param res
        */
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const data = yield Rights.updateOne({ _id: id }, { status: 2 });
            const resp = {
                success: 'Rights deleted sucessfully'
            };
            const response = responseBuilder_1.ResponseBuilder.respSuccess(resp, req.t("SUCCESS"));
            if (response) {
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
        });
        this.deletemany = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const mydata = req.body;
            res.status(200).json({
                data: mydata,
                msg: "Delete Many API"
            });
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const mydata = req.body;
            res.status(200).json({
                data: mydata,
                msg: "Update API"
            });
        });
        this.getAllModule = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const modulesData = yield this.RightsUtils.getModule(req);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(modulesData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        this.getRightById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.RightsUtils.getById(req);
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
    }
}
exports.RightsController = RightsController;
//# sourceMappingURL=rightsControler.js.map