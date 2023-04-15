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
exports.PlatformUtils = void 0;
const mongoose_1 = require("mongoose");
const platformSchema_1 = require("../platform/platformSchema");
const trainingempSchema_1 = require("../trainingemployee/trainingempSchema");
class PlatformUtils {
    /**
     * Employee : Add  Training data
     * @param : any
     * @returns  nothing for the data
     */
    create(userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const platform = new platformSchema_1.Platform(userDetail);
            return yield platform.save();
        });
    }
    getById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        '_id': mongoose_1.Types.ObjectId(req.params.id),
                    },
                },
            ];
            return yield platformSchema_1.Platform.aggregate(reqArr).exec();
        });
    }
    /**
     * Employee : Update Traning For employee
     * @param : any
  
     * @returns
     */
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
}
exports.PlatformUtils = PlatformUtils;
//# sourceMappingURL=platformUtils.js.map