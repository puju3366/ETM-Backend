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
exports.TimelineController = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const commonMessage_1 = require("../../../helpers/commonMessage");
const timelineUtils_1 = require("./timelineUtils");
class TimelineController {
    constructor() {
        this.timelineUtils = new timelineUtils_1.TimelineUtils();
        this.timeline = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.timelineUtils.getById(req);
                const response = responseBuilder_1.ResponseBuilder.respSuccess(data, req.t("SUCCESS"));
                res.status(response.status_code).json(response);
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
    }
}
exports.TimelineController = TimelineController;
//# sourceMappingURL=timelineController.js.map