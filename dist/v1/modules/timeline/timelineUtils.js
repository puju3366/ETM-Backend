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
exports.TimelineUtils = void 0;
const mongoose_1 = require("mongoose");
const timelineSchema_1 = require("./timelineSchema");
class TimelineUtils {
    constructor() {
        // Create User
        this.timeLine = (Data) => __awaiter(this, void 0, void 0, function* () {
            const timeline = new timelineSchema_1.Timeline(Data);
            return yield timeline.save();
        });
    }
    getById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        'emp_id': mongoose_1.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $project: {
                        createdAt: 1,
                        action: 1
                    }
                },
                { $sort: { createdAt: -1 } },
            ];
            return yield timelineSchema_1.Timeline.aggregate(reqArr).exec();
        });
    }
}
exports.TimelineUtils = TimelineUtils;
//# sourceMappingURL=timelineUtils.js.map