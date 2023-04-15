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
exports.TrainingUtils = void 0;
const mongoose_1 = require("mongoose");
const trainingSchema_1 = require("../training/trainingSchema");
class TrainingUtils {
    // Create User
    create(userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const training = new trainingSchema_1.Training(userDetail);
            return yield training.save();
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
            return yield trainingSchema_1.Training.aggregate(reqArr).exec();
        });
    }
    updateTrainingData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof req.body.data === 'object') {
                req.body = req.body.data;
            }
            else {
                req.body = JSON.parse(req.body.data);
            }
            req.body.updated_date = new Date();
            return yield trainingSchema_1.Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
        });
    }
    getAllTrainings(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var filter = { status: 1, focus_area: null, trainingname: null, platform: null, level: null };
            return yield trainingSchema_1.Training.find().sort({ 'createdAt': -1 });
        });
    }
    getTraningDetails(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        '_id': mongoose_1.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'mentor',
                        foreignField: '_id',
                        as: 'mentor'
                    },
                }
            ];
            return yield trainingSchema_1.Training.aggregate(reqArr).exec();
        });
    }
}
exports.TrainingUtils = TrainingUtils;
//# sourceMappingURL=trainingUtils.js.map