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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUtils = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const mongoose_1 = require("mongoose");
const userSchema_1 = require("../user/userSchema");
const utils_1 = require("../../../helpers/utils");
const jwt_1 = require("../../../helpers/jwt");
class UserUtils {
    // Create User
    createUser(userDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new userSchema_1.User(userDetail);
            return yield user.save();
        });
    }
    questionnairemappingUtils(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const questionnairemapping = yield userSchema_1.User.aggregate(req.reqArr).exec();
            return responseBuilder_1.ResponseBuilder.data(questionnairemapping[0]);
        });
    }
    updateuserData(req) {
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
            return yield userSchema_1.User.findByIdAndUpdate(id, req.body, { new: true });
        });
    }
    userProfile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        // eslint-disable-next-line new-cap
                        '_id': mongoose_1.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $lookup: {
                        from: 'usergroups',
                        localField: 'userTypeCode',
                        foreignField: 'typecode',
                        as: 'usergroup',
                    },
                },
            ];
            req.reqArr = reqArr;
            return yield userSchema_1.User.aggregate(req.reqArr).exec();
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSchema_1.User.findOne({ email: email.toLowerCase() });
        });
    }
    getProfile(whereObj) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSchema_1.User.aggregate(whereObj).exec();
        });
    }
    changepassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.oldPassword && req.body.Password && req.payload._id) {
                req.params = {
                    id: req.payload._id,
                };
                const users = yield userSchema_1.User.findOne({
                    _id: req.params.id,
                    status: {
                        $in: [0, 1]
                    },
                });
                const isMatch = yield utils_1.Utils.compareEncryptedText(req.body.oldPassword, users.password);
                if (isMatch) {
                    const hash = yield utils_1.Utils.encryptText(req.body.Password);
                    req.body.password = hash;
                    req.params = {
                        _id: req.payload._id,
                    };
                    req.body.updated_date = new Date();
                    const id = (req.params && req.params.hasOwnProperty('_id') ||
                        req.params.hasOwnProperty('id')) ? (req.params.hasOwnProperty('_id') ?
                        req.params._id : req.params.id) : (req.body._id || req.body.id);
                    req.params.id = id;
                    const userData = yield userSchema_1.User.findByIdAndUpdate(id, req.body, { new: true });
                    return responseBuilder_1.ResponseBuilder.data(userData);
                }
                else {
                    const message = req.t("OLD_PASSWORD_WRONG");
                    return responseBuilder_1.ResponseBuilder.data('', message);
                }
            }
            return responseBuilder_1.ResponseBuilder.data({});
        });
    }
    // verify the user after sign up
    verify(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenData = yield jwt_1.Jwt.decodeAuthToken(req.body.token);
            req.reqArr = { _id: yield utils_1.Utils.reverseString(tokenData.token) };
            req.body = { emailconfirmed: true, status: 1 };
            return yield userSchema_1.User.findOneAndUpdate(req.reqArr, req.body, {
                new: true,
                runValidators: true
            });
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.password && req.body.confirmPassword && req.body.token) {
                const hash = yield utils_1.Utils.encryptText(req.body.password);
                req.body.password = hash;
                const tokenData = yield jwt_1.Jwt.decodeAuthToken(req.body.token);
                req.body.id = yield utils_1.Utils.reverseString(tokenData.token);
                req.body.updated_date = new Date();
                const id = req.body.id;
                const data = yield userSchema_1.User.findByIdAndUpdate(id, req.body, { new: true });
                return data;
            }
        });
    }
    forgotPassword(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        'email': req.body.email,
                    },
                },
                {
                    $lookup: {
                        from: 'usergroups',
                        localField: 'userTypeCode',
                        foreignField: 'typecode',
                        as: 'usergroup',
                    },
                },
                {
                    $project: {
                        'id': 1,
                        'firstname': 1,
                        'lastname': 1,
                        'email': 1,
                        'phone': 1,
                        'emailconfirmed': 1,
                        'userTypeCode': 1,
                        'usergroup': 1,
                    },
                },
            ];
            req.reqArr = reqArr;
            return yield userSchema_1.User.aggregate(req.reqArr).exec();
        });
    }
    userReportingRole(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        // eslint-disable-next-line new-cap
                        '_id': mongoose_1.Types.ObjectId(req.params.id),
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'reporting_manager',
                        foreignField: '_id',
                        as: 'reporting_manager',
                    },
                },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'userrole',
                        foreignField: '_id',
                        as: 'roles',
                    },
                },
                {
                    $project: {
                        lastname: 1,
                        email: 1,
                        firstname: 1,
                        phone: 1,
                        reporting_manager: '$reporting_manager',
                        roles: '$roles.rolename',
                        rolesId: '$roles._id'
                    },
                },
            ];
            req.reqArr = reqArr;
            return yield userSchema_1.User.aggregate(req.reqArr).exec();
        });
    }
    updateuserDataById(id, userdata) {
        return __awaiter(this, void 0, void 0, function* () {
            userdata.updated_date = new Date();
            // req.body.updated_by = req.payload._id;
            return yield userSchema_1.User.findByIdAndUpdate(id, userdata, { new: true });
        });
    }
    getdateforweek() {
        const current = new Date(); // get current date    
        current.setHours(0, 0, 0, 0);
        const weekstart = current.getDate() - current.getDay() - 6;
        const weekend = weekstart + 6; // end day is the first day + 6 
        const monday = new Date(current.setDate(weekstart));
        const sunday = new Date(current.setDate(weekend));
        const startDate = new Date(monday.getTime() - (monday.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
        const endDate = new Date(sunday.getTime() - (sunday.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
        return { startDate, endDate };
    }
    getAllReporting(reportingid, userdata = []) {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { startDate, endDate } = this.getdateforweek();
            const reqArr = [
                {
                    $lookup: {
                        from: 'emp_progresses',
                        as: 'empusers',
                        let: { "mainid": "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$emp_id", "$$mainid"] },
                                            { "$eq": ["$start_week", new Date(startDate)] },
                                            { "$eq": ["$end_week", new Date(endDate)] },
                                        ]
                                    }
                                }
                            },
                        ],
                    }
                },
                {
                    $match: { /* 'empusers': [], */ 'reporting_manager': mongoose_1.Types.ObjectId(reportingid), 'status': 1 }
                },
            ];
            const result = yield this.getProfile(reqArr);
            if (result.length > 0) {
                try {
                    for (var result_1 = __asyncValues(result), result_1_1; result_1_1 = yield result_1.next(), !result_1_1.done;) {
                        const element = result_1_1.value;
                        if (element.empusers.length === 0)
                            userdata.push(element.email);
                        yield this.getAllReporting(element._id, userdata);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (result_1_1 && !result_1_1.done && (_a = result_1.return)) yield _a.call(result_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            // console.log('userdata', userdata);
            return userdata;
        });
    }
    getAllPM() {
        return __awaiter(this, void 0, void 0, function* () {
            //get all pm having band A
            const getPMArr = [{
                    $match: {
                        userband: 'A',
                        status: 1,
                        email: 'shomy.sathyadevan@devitpl.com'
                    }
                }];
            return yield this.getProfile(getPMArr);
        });
    }
    getAllEmployeeProgress(reportingid, userdata = []) {
        var e_2, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const reqArr = [
                {
                    $match: {
                        'reporting_manager': mongoose_1.Types.ObjectId(reportingid), 'status': 1
                    }
                },
                {
                    $lookup: {
                        from: 'emp_progresses',
                        localField: '_id',
                        foreignField: 'emp_id',
                        as: 'emp_progress'
                    },
                },
                {
                    $lookup: {
                        from: 'trainings',
                        localField: 'emp_progress.training_id',
                        foreignField: '_id',
                        as: 'training'
                    },
                },
                {
                    $project: {
                        user: "$$ROOT",
                        completed_videos: { $sum: "$emp_progress.completed_videos" }
                    }
                }
            ];
            const result = yield this.getProfile(reqArr);
            if (result.length > 0) {
                try {
                    for (var result_2 = __asyncValues(result), result_2_1; result_2_1 = yield result_2.next(), !result_2_1.done;) {
                        const element = result_2_1.value;
                        userdata.push("<tr><td>" + element.user.email + "</td><td>" + element.user.firstname + "</td><td>" + element.completed_videos + "</td></tr>");
                        yield this.getAllEmployeeProgress(element.user._id, userdata);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (result_2_1 && !result_2_1.done && (_a = result_2.return)) yield _a.call(result_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            return userdata;
        });
    }
    assignRoles(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield userSchema_1.User.findOneAndUpdate({ _id: req.employee_id, }, { $set: { userrole: req.role } }, { new: true });
        });
    }
    fetchRights(req) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("req", req.id);
            const reqArr = [
                {
                    $match: {
                        '_id': mongoose_1.Types.ObjectId(req.id)
                    }
                },
                {
                    $lookup: {
                        from: 'roles',
                        localField: 'userrole',
                        foreignField: '_id',
                        as: 'rolePermision'
                    }
                }
            ];
            req.reqArr = reqArr;
            return userSchema_1.User.aggregate(req.reqArr).exec();
        });
    }
}
exports.UserUtils = UserUtils;
//# sourceMappingURL=userUtils.js.map