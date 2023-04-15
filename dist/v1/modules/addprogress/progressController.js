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
exports.ProgressController = void 0;
const mongoose_1 = require("mongoose");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const progressUtils_1 = require("./progressUtils");
const progressSchema_1 = require("./progressSchema");
const userSchema_1 = require("../user/userSchema");
const trainingSchema_1 = require("../training/trainingSchema");
const commonMessage_1 = require("../../../helpers/commonMessage");
const timelineUtils_1 = require("../timeline/timelineUtils");
const ExcelJS = require('exceljs');
class ProgressController {
    constructor() {
        this.progressUtils = new progressUtils_1.ProgressUtils();
        this.timelineUtils = new timelineUtils_1.TimelineUtils();
        this.addProgress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const employee = yield userSchema_1.User.findOne({ '_id': req.body.emp_id });
                var training = yield trainingSchema_1.Training.findOne({ '_id': req.body.training_id });
                if (Object.is(employee, null) || Object.is(training, null)) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                    return false;
                }
                const progress = yield this.progressUtils.create(req.body);
                var start = new Date(progress.start_week);
                const startWeek = start.toISOString().substring(0, 10);
                var end = new Date(progress.end_week);
                const endWeek = end.toISOString().substring(0, 10);
                const response = responseBuilder_1.ResponseBuilder.respSuccess(progress, req.t("SUCCESS"));
                if (response) {
                    const data = {
                        emp_id: req.payload._id,
                        trainig_id: training._id,
                        action: "You have completed " + progress.completed_videos + " videos for " + training.trainingname + ' training (' + startWeek + ' to ' + endWeek + ')',
                    };
                    yield this.timelineUtils.timeLine(data);
                }
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
        this.viewProgress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const reqArr = [
                    {
                        $match: {
                            'emp_id': mongoose_1.Types.ObjectId(req.body.emp_id),
                            'training_id': mongoose_1.Types.ObjectId(req.body.training_id),
                        }
                    },
                    {
                        $project: {
                            start_week: 1,
                            end_week: 1,
                            completed_videos: 1
                        }
                    }
                ];
                const progress = yield progressSchema_1.Progress.aggregate(reqArr).exec();
                if (Object.is(progress, null)) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                    return false;
                }
                const response = responseBuilder_1.ResponseBuilder.respSuccess(progress, req.t("SUCCESS"));
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
        this.getTrainingDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dashboardData = yield this.progressUtils.getTraningNameById(req);
            const startWeeklength = dashboardData[0].startweek.length;
            const endWeeklength = dashboardData[0].endweek.length;
            let startweek = dashboardData[0].startweek[startWeeklength - 1];
            let endweek = dashboardData[0].endweek[endWeeklength - 1];
            const data = {
                dashboardData: dashboardData,
                start_week: startweek,
                end_week: endweek
            };
            const response = responseBuilder_1.ResponseBuilder.respSuccess(data, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        this.viewUserProgress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const reqArr = [
                    {
                        $match: {
                            'emp_id': mongoose_1.Types.ObjectId(req.params.id),
                        }
                    },
                    {
                        $lookup: {
                            from: 'trainings',
                            localField: 'training_id',
                            foreignField: '_id',
                            as: 'training'
                        },
                    },
                    {
                        $project: {
                            start_week: 1,
                            end_week: 1,
                            completed_videos: 1,
                            'training.trainingname': 1,
                            'training.level': 1
                        }
                    },
                    { $sort: { 'training.trainingname': 1 } }
                ];
                const progress = yield progressSchema_1.Progress.aggregate(reqArr).exec();
                if (Object.is(progress, null)) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                    return false;
                }
                const response = responseBuilder_1.ResponseBuilder.respSuccess(progress, req.t("SUCCESS"));
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
        this.exportUserProgress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRecursive(req.params.id);
                if (Object.is(user, null)) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                    return false;
                }
                const response = responseBuilder_1.ResponseBuilder.respSuccess(user, req.t("SUCCESS"));
                res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
            catch (e) {
                res.status(commonMessage_1.MessageModule.status.error).json(e);
            }
        });
    }
    userRecursive(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        'reporting_manager': mongoose_1.Types.ObjectId(id)
                    }
                },
            ];
            const progress = yield userSchema_1.User.aggregate(reqArr).exec();
            const cnt = progress.length;
            var user = '';
            if (cnt > 0) {
                progress.forEach((row) => __awaiter(this, void 0, void 0, function* () {
                    // user += row.firstname + "\n";
                    const ids = row._id.toString();
                    user += yield this.userRecursive(ids);
                }));
            }
            ;
            return user;
        });
    }
}
exports.ProgressController = ProgressController;
//# sourceMappingURL=progressController.js.map