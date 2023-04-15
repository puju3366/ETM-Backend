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
exports.TrainingController = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const trainingUtils_1 = require("./trainingUtils");
const commonMessage_1 = require("../../../helpers/commonMessage");
const trainingSchema_1 = require("./trainingSchema");
const trainingempSchema_1 = require("../trainingemployee/trainingempSchema");
const progressSchema_1 = require("../addprogress/progressSchema");
const timelineUtils_1 = require("../timeline/timelineUtils");
const timelineSchema_1 = require("../timeline/timelineSchema");
class TrainingController {
    constructor() {
        this.trainingUtils = new trainingUtils_1.TrainingUtils();
        this.timelineUtils = new timelineUtils_1.TimelineUtils();
        /**
         * @method create
         * @description : for Creating training.
         * @param req
         * @param res
         * @return JSON object
         * @author  : DEVIT Cloud Team
         * @created : 05/04/2022
         */
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const mydata = req.body;
            const trainingData = yield this.trainingUtils.create(mydata);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(trainingData, req.t("SUCCESS"));
            if (response) {
                const merge = trainingData.trainingname.charAt(0).toUpperCase() + trainingData.trainingname.slice(1);
                const data = {
                    emp_id: req.payload._id,
                    training_id: trainingData._id,
                    action: merge.bold() + ' ' + "training has been Created.",
                };
                yield this.timelineUtils.timeLine(data);
            }
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        /**
        * @method getTrainingById
        * @description : Get training details by training id.
        * @param req
        * @param res
        * @return JSON object
        * @author  : DEVIT Cloud Team
        * @created : 05/04/2022
        */
        this.getTrainingById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.trainingUtils.getTraningDetails(req);
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
         * @method edit
         * @description : Edit training details.
         * @param req
         * @param res
         */
        this.edit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.params.id;
                // const result = await Training.findOne({_id});
                const result = yield this.trainingUtils.getById(req);
                if (Object.entries(result).length === 0) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                }
                else {
                    const trainingName = yield trainingSchema_1.Training.find({ _id: req.params.id }).exec();
                    const trainingData = yield trainingSchema_1.Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
                    const changedData = yield this.getChangedData(trainingName, trainingData);
                    var actionData = changedData.toString() + '.';
                    const response = responseBuilder_1.ResponseBuilder.respSuccess(trainingData, req.t("SUCCESS"));
                    if (response) {
                        const data = {
                            emp_id: req.payload._id,
                            training_id: trainingName[0]._id,
                            action: actionData,
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
        this.getChangedData = (trainingName, trainingData) => __awaiter(this, void 0, void 0, function* () {
            var actioning = [];
            if (trainingName[0].trainingname != trainingData.trainingname) {
                const data = trainingName[0].trainingname + " training name has been renamed to " + trainingData.trainingname.bold() + " ";
                actioning.push(data);
            }
            if (trainingName[0].platform != trainingData.platform) {
                const data = trainingName[0].platform + " platform has been renamed to " + trainingData.platform.bold() + " ";
                actioning.push(data);
            }
            if (trainingName[0].courselink != trainingData.courselink) {
                const data = trainingName[0].courselink + " courselink has been renamed to " + trainingData.courselink + " ";
                actioning.push(data);
            }
            if (trainingName[0].focus_area != trainingData.focus_area) {
                const data = trainingName[0].focus_area + " focusarea has been renamed to " + trainingData.focus_area.bold() + " ";
                actioning.push(data);
            }
            if (trainingName[0].level != trainingData.level) {
                const data = trainingName[0].level + " level has been renamed to " + trainingData.level.bold() + " ";
                actioning.push(data);
            }
            if (trainingName[0].no_of_video != trainingData.no_of_video) {
                const data = trainingName[0].no_of_video + " no of vidoes has been updated to " + trainingData.no_of_video.bold() + " ";
                actioning.push(data);
            }
            if (trainingName[0].startdate != trainingData.startdate) {
                const data = trainingName[0].startdate + " start date has been changed to " + trainingData.startdate.bold() + " ";
                actioning.push(data);
            }
            if (trainingName[0].endate != trainingData.endate) {
                const data = trainingName[0].endate + " end date has been changed to " + trainingData.endate.bold() + " ";
                actioning.push(data);
            }
            if (trainingName[0].mentor != trainingData.mentor) {
                const data = "Mentor has been changed for " + trainingName[0].trainingname.bold() + " training";
                actioning.push(data);
            }
            return actioning;
        });
        /**
         * @method delete
         * @description : delete training.
         * @param req
         * @param res
         */
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const _id = req.params.id;
                const result = yield this.trainingUtils.getById(req);
                if (Object.entries(result).length === 0) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                }
                else {
                    const trainingName = yield this.trainingUtils.getById(req);
                    const result = yield trainingSchema_1.Training.deleteOne({ "_id": _id });
                    yield trainingempSchema_1.TrainingEmp.deleteOne({ "training_id": _id });
                    yield progressSchema_1.Progress.remove({ "training_id": _id });
                    yield timelineSchema_1.Timeline.remove({ "training_id": _id });
                    const response = responseBuilder_1.ResponseBuilder.respSuccess(result, commonMessage_1.MessageModule.message.delete);
                    if (response) {
                        const merge = trainingName[0].trainingname.charAt(0).toUpperCase() + trainingName[0].trainingname.slice(1);
                        const data = {
                            emp_id: req.payload._id,
                            action: merge.bold() + ' ' + "training has been deleted.",
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
        /**
         * @method getAll
         * @description : Get all the training details for listing.
         * @param req
         * @param res
         */
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const trainingData = yield this.trainingUtils.getAllTrainings(req);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(trainingData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
    }
}
exports.TrainingController = TrainingController;
//# sourceMappingURL=trainingController.js.map