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
exports.DashboardController = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const dashboardUtils_1 = require("./dashboardUtils");
const trainingempSchema_1 = require("../trainingemployee/trainingempSchema");
const timelineUtils_1 = require("../timeline/timelineUtils");
const progressSchema_1 = require("../addprogress/progressSchema");
const trainingSchema_1 = require("../training/trainingSchema");
const commonMessage_1 = require("../../../helpers/commonMessage");
var moment = require('moment'); // require
class DashboardController {
    constructor() {
        this.dashboardUtils = new dashboardUtils_1.DashboardUtils();
        this.timelineUtils = new timelineUtils_1.TimelineUtils();
        this.getTraningName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dashboardData = yield this.dashboardUtils.getTraningName(req);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(dashboardData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        this.getTotalvideos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dashboardData = yield this.dashboardUtils.totalVideos(req);
            const week = yield progressSchema_1.Progress.find({ emp_id: req.body.emp_id, training_id: req.body.training_id }).sort({ createdAt: -1 }).limit(1);
            if (Object.entries(dashboardData).length === 0 || Object.is(dashboardData, null)) {
                const response = {
                    Success: "Data not found."
                };
                return res.status(commonMessage_1.MessageModule.status.ok).json(response);
            }
            const allData = {
                dashboardData: dashboardData,
                start_week: week[0].start_week,
                end_week: week[0].end_week
            };
            const response = responseBuilder_1.ResponseBuilder.respSuccess(allData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        this.dashboard = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dashboardData = yield trainingempSchema_1.TrainingEmp.find({ emp_id: req.params.id });
            var total = 0;
            for (let i = 0; i < dashboardData.length; i++) {
                const totalvideos = yield trainingSchema_1.Training.find({ _id: dashboardData[i].training_id });
                total += parseInt(totalvideos[0].no_of_video);
            }
            const trainingVideos = yield progressSchema_1.Progress.find({ emp_id: req.params.id });
            // console.log(trainingVideos)
            var completed = 0;
            for (let i = 0; i < trainingVideos.length; i++) {
                completed += parseInt(trainingVideos[i].completed_videos);
            }
            const data = {
                TrainingCount: dashboardData.length,
                TotalVideos: total,
                TotalCompletedVideos: completed,
                progress: Math.round(completed / total * 100)
            };
            const response = responseBuilder_1.ResponseBuilder.respSuccess(data, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        this.getWeeksInMonth = (year, month) => __awaiter(this, void 0, void 0, function* () {
            const weeks = [], firstDate = new Date(year, month, 1), lastDate = new Date(year, month + 1, 0), numDays = lastDate.getDate();
            let dayOfWeekCounter = firstDate.getDay();
            for (let date = 1; date <= numDays; date++) {
                if (dayOfWeekCounter === 0 || weeks.length === 0) {
                    weeks.push([]);
                }
                weeks[weeks.length - 1].push(date);
                dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
            }
            return weeks
                .filter((w) => !!w.length)
                .map((w) => ({
                start: w[0],
                end: w[w.length - 1],
                dates: w,
            }));
        });
        this.graph = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var date = new Date();
            var check = yield this.getWeeksInMonth(date.getFullYear(), date.getMonth());
            var week = [];
            var videos = [];
            for (let i = 0; i < check.length; i++) {
                week.push("Week " + (i + 1));
                var data1 = yield progressSchema_1.Progress.find({ createdAt: { $gte: moment([date.getFullYear(), date.getMonth(), check[i].start + 1]).toISOString(), $lt: moment([date.getFullYear(), date.getMonth(), check[i].end + 1]).toISOString() } });
                var sum = 0;
                if (data1.length === 0) {
                    sum = 0;
                }
                else {
                    for (let j = 0; j < data1.length; j++) {
                        sum += parseInt(data1[j].completed_videos);
                    }
                }
                videos.push(sum);
            }
            console.log(week, videos);
            const resp = {
                x: week,
                y: videos
            };
            const response = responseBuilder_1.ResponseBuilder.respSuccess(resp, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        this.getTraningProgress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const dashboarddata = yield this.dashboardUtils.update(req);
            if (dashboarddata) {
                const response = responseBuilder_1.ResponseBuilder.respSuccess(dashboarddata, req.t("SUCCESS"));
                res.status(dashboarddata.code).json(response);
            }
            else {
                res.status(commonMessage_1.MessageModule.status.ok).json(dashboarddata);
            }
        });
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboardController.js.map