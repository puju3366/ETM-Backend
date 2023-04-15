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
exports.RightsUtils = void 0;
const mongoose_1 = require("mongoose");
const { Modules } = require('./rightsSchema');
const { Rights } = require('./rightsSchema');
class RightsUtils {
    getModule(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Modules.find();
        });
    }
    getRights(req) {
        return __awaiter(this, void 0, void 0, function* () {
            // { status: { $in: [1, 0] } }).sort({ 'createdAt': -1 }
            const reqArr = [{
                    $match: {
                        status: { $in: [1, 0] }
                    }
                },
                {
                    $lookup: {
                        from: 'modules',
                        localField: 'moduleID',
                        foreignField: '_id',
                        as: 'rights'
                    }
                }
            ];
            req.reqArr = reqArr;
            return yield Rights.aggregate(req.reqArr).exec();
        });
    }
    createRight(rightDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const right = new Rights(rightDetail);
            return yield right.save();
        });
    }
    createSlug(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduledata = req.moduledata.split(" ");
            const number = moduledata.length;
            const module = moduledata.splice(1, number);
            let text = "";
            function slug(item, index) {
                text += item.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
            module.forEach(slug);
            const slugName = text + "/" + req.rightname.toLowerCase();
            return slugName;
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
            return yield Rights.aggregate(reqArr).exec();
        });
    }
    updateRightData(req) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.updated_date = new Date();
            return yield Rights.findByIdAndUpdate(req.params.id, req.body, { new: true });
        });
    }
    getModuleById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        '_id': mongoose_1.Types.ObjectId(req.body.moduleID),
                    },
                },
            ];
            return yield Modules.aggregate(reqArr).exec();
        });
    }
}
exports.RightsUtils = RightsUtils;
//# sourceMappingURL=rightsUtils.js.map