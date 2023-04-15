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
exports.ProgressUtils = void 0;
const mongoose_1 = require("mongoose");
const dashboardSchema_1 = require("../dashboard/dashboardSchema");
const progressSchema_1 = require("./progressSchema");
const trainingempSchema_1 = require("../trainingemployee/trainingempSchema");
class ProgressUtils {
    /**
     * Employee : Add  Training data
     * @param : any
     * @returns  nothing for the data
     */
    create(userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = new progressSchema_1.Progress(userDetail);
            return yield progress.save();
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
                // {
                //   $lookup: {
                //     from: 'users',
                //     localField: 'emp_id',
                //     foreignField: '_id',
                //     as: 'user'
                // },
                //   $match: {
                //     'user._id': Types.ObjectId(req.params.id),
                //  },
                // },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'training.mentor',
                        foreignField: '_id',
                        as: 'mentors'
                    },
                },
            ];
            req.reqArr = reqArr;
            return yield trainingempSchema_1.TrainingEmp.aggregate(req.reqArr).exec();
        });
    }
    // Get event details by id
    getTraningNameById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        'training_id': mongoose_1.Types.ObjectId(req.params.id)
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
                    $lookup: {
                        from: 'users',
                        localField: 'training.mentor',
                        foreignField: '_id',
                        as: 'mentors'
                    },
                },
                { $sort: { "completed.createdAt": -1 } },
                {
                    $project: {
                        training: "$training",
                        completed_videos: { $sum: "$completed.completed_videos" },
                        startweek: "$completed.start_week",
                        endweek: "$completed.end_week",
                        completed_videos_per: { $multiply: [{ $divide: ["$completed.completed_videos", "$sum"] }, 100] },
                        mentor: "$mentors"
                    }
                }
            ];
            req.reqArr = reqArr;
            return yield trainingempSchema_1.TrainingEmp.aggregate(req.reqArr).exec();
        });
    }
}
exports.ProgressUtils = ProgressUtils;
//# sourceMappingURL=progressUtils.js.map