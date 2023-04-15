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
exports.DashboardUtils = void 0;
const mongoose_1 = require("mongoose");
const dashboardSchema_1 = require("../dashboard/dashboardSchema");
const trainingempSchema_1 = require("../trainingemployee/trainingempSchema");
const progressSchema_1 = require("../addprogress/progressSchema");
class DashboardUtils {
    /**
     * Employee : Add  Training data
     * @param : any
     * @returns  nothing for the data
     */
    create(userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const dashboard = new dashboardSchema_1.Dashboard(userDetail);
            return yield dashboard.save();
        });
    }
    /**
     * Employee : Update Traning For employee
     * @param : any
  
     * @returns
     */
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof req.body.data === 'object') {
                req.body = req.body.data;
            }
            else {
                req.body = JSON.parse(req.body.data);
            }
            req.body.updated_date = new Date();
            // req.body.updated_by = req.payload._id;
            const id = (req.params &&
                req.params.hasOwnProperty('_id') ||
                req.params.hasOwnProperty('id')) ?
                (req.params.hasOwnProperty('_id') ?
                    req.params._id : req.params.id) :
                (req.body._id || req.body.id);
            req.params.id = id;
            return yield dashboardSchema_1.Dashboard.findByIdAndUpdate(id, req.body, { new: true });
        });
    }
    // Get event details by id
    getTraningName(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        'emp_id': mongoose_1.Types.ObjectId(req.params.id)
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
                    $lookup: {
                        from: 'emp_progresses',
                        localField: 'training_id',
                        foreignField: 'training_id',
                        as: 'completed'
                    },
                },
                // {
                //   $match: {
                //     "completed.emp_id" : Types.ObjectId(req.params.id)
                //   }
                // },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'training.mentor',
                        foreignField: '_id',
                        as: 'mentors'
                    },
                },
                {
                    $project: {
                        training: "$training",
                        // completed_videos: { $sum: "$completed.completed_videos"},
                        mentor: "$mentors"
                    }
                }
            ];
            req.reqArr = reqArr;
            return yield trainingempSchema_1.TrainingEmp.aggregate(req.reqArr).exec();
        });
    }
    trainingVideos(req) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.log(req);
            // return await Dashboard.findOne({_id: req.params.id})
            const reqArr = [
                {
                    $match: {
                        'emp_id': mongoose_1.Types.ObjectId(req.params.id)
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
                    $lookup: {
                        from: 'emp_progresses',
                        localField: 'training_id',
                        foreignField: 'training_id',
                        as: 'completed'
                    },
                },
                {
                    $match: {
                        "completed.emp_id": mongoose_1.Types.ObjectId(req.params.id)
                    }
                },
                {
                    $project: {
                        totalVideos: "$training.no_of_video",
                        completed_videos: { $sum: "$completed.completed_videos" },
                    }
                }
            ];
            req.reqArr = reqArr;
            return yield trainingempSchema_1.TrainingEmp.aggregate(req.reqArr).exec();
        });
    }
    totalVideos(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        training_id: mongoose_1.Types.ObjectId(req.body.training_id)
                    }
                },
                {
                    $match: {
                        emp_id: mongoose_1.Types.ObjectId(req.body.emp_id)
                    }
                },
                {
                    $group: {
                        _id: '',
                        "Amount": { $sum: '$completed_videos' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        videos: { $sum: '$Amount' },
                    }
                }
            ];
            return yield progressSchema_1.Progress.aggregate(reqArr).exec();
        });
    }
}
exports.DashboardUtils = DashboardUtils;
//# sourceMappingURL=dashboardUtils.js.map