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
exports.CategoryController = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const categoryUtils_1 = require("./categoryUtils");
const commonMessage_1 = require("../../../helpers/commonMessage");
class CategoryController {
    constructor() {
        this.categoryUtils = new categoryUtils_1.CategoryUtils();
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const categorysData = yield this.categoryUtils.getAllLocations(req);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(categorysData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
    }
}
exports.CategoryController = CategoryController;
//# sourceMappingURL=categoryController.js.map