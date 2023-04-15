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
exports.FocusAreaController = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const focusareaUtils_1 = require("./focusareaUtils");
const commonMessage_1 = require("../../../helpers/commonMessage");
const focusareaSchema_1 = require("./focusareaSchema");
const timelineUtils_1 = require("../timeline/timelineUtils");
class FocusAreaController {
    constructor() {
        this.focusaraeaUtils = new focusareaUtils_1.FocusareaUtils();
        this.timelineUtils = new timelineUtils_1.TimelineUtils();
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const mydata = req.body;
                const platform = yield this.focusaraeaUtils.create(mydata);
                const response = responseBuilder_1.ResponseBuilder.respSuccess(platform, req.t("SUCCESS"));
                if (response) {
                    const data = {
                        emp_id: req.payload._id,
                        action: platform.focus_area + ' ' + "Focus area has been Created.",
                    };
                    yield this.timelineUtils.timeLine(data);
                }
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
        this.edit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.focusaraeaUtils.getById(req);
                if (Object.is(result, null)) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                }
                else {
                    const focusarea = yield this.focusaraeaUtils.getById(req);
                    const platformData = yield focusareaSchema_1.Focusarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
                    const afterfocusarea = yield this.focusaraeaUtils.getById(req);
                    const response = responseBuilder_1.ResponseBuilder.respSuccess(platformData, req.t("SUCCESS"));
                    if (response) {
                        const data = {
                            emp_id: req.payload._id,
                            action: focusarea[0].focus_area + " " + "focus area has been edited to " + afterfocusarea[0].focus_area + ".",
                        };
                        yield this.timelineUtils.timeLine(data);
                    }
                    res.status(commonMessage_1.MessageModule.status.ok).json(response);
                }
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.params.id;
                var result = yield this.focusaraeaUtils.getById(req);
                if (Object.is(result, null)) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                }
                else {
                    const deleted = yield focusareaSchema_1.Focusarea.deleteOne({ "_id": _id });
                    const response = responseBuilder_1.ResponseBuilder.respSuccess(deleted, commonMessage_1.MessageModule.message.delete);
                    if (response) {
                        const data = {
                            emp_id: req.payload._id,
                            action: result[0].focus_area + " " + "focus area has been deleted",
                        };
                        yield this.timelineUtils.timeLine(data);
                    }
                    res.status(commonMessage_1.MessageModule.status.ok).json(response);
                }
            }
            catch (e) {
                e.message = 'not found';
                res.status(404).send({ e, error: e.message, status: 404 });
            }
        });
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.params.id;
                const result = yield focusareaSchema_1.Focusarea.find({}).sort({ 'createdAt': -1 });
                const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
        this.getById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield focusareaSchema_1.Focusarea.find({ _id: req.params.id });
                const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
    }
}
exports.FocusAreaController = FocusAreaController;
//# sourceMappingURL=focusareaController.js.map