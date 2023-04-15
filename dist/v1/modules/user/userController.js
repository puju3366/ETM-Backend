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
exports.UserController = void 0;
const constants_1 = require("../../../config/constants");
const jwt_1 = require("../../../helpers/jwt");
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const userUtils_1 = require("./userUtils");
const utils_1 = require("../../../helpers/utils");
const sendEmail_1 = require("../../../helpers/sendEmail");
const bcrypt = require("bcryptjs");
const commonMessage_1 = require("../../../helpers/commonMessage");
const userSchema_1 = require("./userSchema");
const roleUtils_1 = require("../roles/roleUtils");
const mongoose_1 = require("mongoose");
var request = require('request');
const xml2js = require("xml2js");
class UserController {
    constructor() {
        this.userUtils = new userUtils_1.UserUtils();
        this.roleUtils = new roleUtils_1.RoleUtils();
        this.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            input.password = yield utils_1.Utils.encryptText(input.password);
            input.emailHash = bcrypt.hashSync(input.email, 12);
            const result = yield this.userUtils.createUser(input);
            if (result && result._id) {
                const objData = result;
                delete objData.password;
                const reverseIdObj = { 'token': utils_1.Utils.reverseString(objData._id.toString()) };
                const token = jwt_1.Jwt.getAuthToken(reverseIdObj);
                const url = process.env.VERIFYACCOUNT + token;
                const userDetails = result;
                const emailData = {
                    "verify_link": url,
                };
                sendEmail_1.SendEmail.sendRawMail("verify-email", emailData, [input.email], `Please confirm your email account`, "");
                const response = responseBuilder_1.ResponseBuilder.respSuccess(userDetails, req.t("SIGNUP_SUCCESS"));
                res.status(response.status_code).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.respSuccess(result.result, req.t("SIGNUP_SUCCESS"));
                res.status(response.status_code).json(response);
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const result = yield this.userUtils.getUserByEmail(email);
            if (result) {
                const userData = result;
                const verifyPassword = yield utils_1.Utils.compareEncryptedText(password, userData.password);
                if (verifyPassword) {
                    const reqArr = [
                        {
                            $match: {
                                'email': email.toLowerCase(),
                            },
                        },
                        {
                            $lookup: {
                                from: 'roles',
                                localField: 'userrole',
                                foreignField: '_id',
                                as: 'role'
                            },
                        },
                        {
                            $lookup: {
                                from: 'roles',
                                localField: 'userrole',
                                foreignField: '_id',
                                as: 'rolePermision'
                            }
                        },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'reporting_manager',
                                foreignField: '_id',
                                as: 'reportingManager'
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
                                'status': 1,
                                'userrole': '$role.rolename',
                                'reporting_manager': "$reportingManager",
                                'user_permission': "$rolePermision"
                            },
                        },
                    ];
                    const finalresult = yield this.userUtils.getProfile(reqArr);
                    const userDetails = finalresult[0];
                    if (userDetails.emailconfirmed === true) {
                        userDetails.token = jwt_1.Jwt.getAuthToken(userDetails);
                    }
                    const data = {
                        'accessToken': 'Bearer ' + userDetails.token,
                        'user': userDetails,
                        'status': userDetails.status,
                    };
                    delete userDetails.token;
                    const response = responseBuilder_1.ResponseBuilder.respSuccess(data, req.t("LOGIN_SUCCESS"));
                    res.status(response.status_code).json(response);
                }
                else {
                    res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t("INVALID_CREDENTIAL") });
                }
            }
        });
        this.userProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userUtils.userProfile(req);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
                res.status(response.status_code).json(response);
            }
            else {
                res.status(commonMessage_1.MessageModule.status.ok).json(result);
            }
        });
        this.updateuserData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const usersData = yield this.userUtils.updateuserData(req);
            if (usersData) {
                const response = responseBuilder_1.ResponseBuilder.respSuccess(usersData, req.t("SUCCESS"));
                res.status(usersData.code).json(response);
            }
            else {
                res.status(commonMessage_1.MessageModule.status.ok).json(usersData);
            }
        });
        this.forgotPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const input = req.body;
            const result = yield this.userUtils.forgotPassword(req);
            if (result.length > 0) {
                const objData = result[0];
                delete objData.password;
                const reverseIdObj = { 'token': utils_1.Utils.reverseString(objData._id.toString()) };
                const token = jwt_1.Jwt.getAuthToken(reverseIdObj);
                const url = process.env.ADMINURLSETPASSWORD + token;
                const userDetails = result[0];
                const emailData = {
                    "reset_password": url,
                };
                sendEmail_1.SendEmail.sendRawMail("forgot-password", emailData, [input.email], `Reset Password`, "");
                const response = responseBuilder_1.ResponseBuilder.respSuccess(userDetails, req.t("FORGOT_PASSWORD"));
                res.status(response.status_code).json(response);
            }
            else {
                const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("FORGOT_PASSWORD"));
                res.status(response.status_code).json(response);
            }
        });
        this.verify = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const error = {
                message: 'token Is Not Fount',
            };
            if (req.params.version || req.body.token) {
                const result = yield this.userUtils.verify(req);
                if (result) {
                    res.end("Email is been Successfully verified");
                }
                else {
                    res.end("Email is not verified");
                }
            }
            else {
                res.status(constants_1.Constants.INTERNAL_SERVER).json(error);
            }
        });
        this.changepassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userUtils.changepassword(req);
            if (result.result) {
                const response = responseBuilder_1.ResponseBuilder.respSuccess(result.result, req.t("PASSWORD_UPDATED"));
                res.status(result.code).json(response);
            }
            else {
                res.status(commonMessage_1.MessageModule.status.ok).json(result);
            }
        });
        this.resetPassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userUtils.resetPassword(req, res);
            if (result) {
                const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("PASSWORD_RESETED"));
                res.status(response.status_code).json(response);
            }
            else {
                res.status(commonMessage_1.MessageModule.status.ok).json(result);
            }
        });
        /**
         * @method getEmployees
         * @description : Get all employees.
         * @param req
         * @param res
         */
        this.getEmployees = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // const email = req.body.email;
            const reqArr = [
                //  { 
                //    $match: {
                //     'email' : email
                //   }
                // },
                {
                    $project: {
                        'id': 1,
                        'email': 1,
                        'firstname': 1,
                        'lastname': 1,
                    },
                }
            ];
            const result = yield this.userUtils.getProfile(reqArr);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
            res.status(response.status_code).json(response);
        });
        /**
         * @method getEmployee
         * @description : Get all employee by id.
         * @param req
         * @param res
         */
        this.getEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // const email = req.body.email;
            const arr = req.body.mentor_id;
            var result = [];
            for (let i = 0; i < arr.length; i++) {
                var details = yield userSchema_1.User.findOne({ _id: arr[i] }, { firstname: 1, lastname: 1 });
                result.push(details);
            }
            console.log(result);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
            res.status(response.status_code).json(response);
        });
        this.getuser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userUtils.userReportingRole(req);
                if (Object.is(result, null)) {
                    const response = responseBuilder_1.ResponseBuilder.notFound(commonMessage_1.MessageModule.message.notFound);
                    res.status(commonMessage_1.MessageModule.status.not_found).json(response);
                }
                const response = responseBuilder_1.ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
                res.status(response.status_code).json(response);
            }
            catch (e) {
                e.message = 'something went wrong';
                res.status(404).send({ e, error: e.message, status: 404 });
            }
        });
        this.import = (req, res) => __awaiter(this, void 0, void 0, function* () {
            request.post({
                url: process.env.ADAPIENDPOINT, headers: {
                    'private-key': process.env.ADAPIKEY
                }
            }, (err, response, body) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(500).json({ errors: "something went wrong" });
                }
                if (response.statusCode == 200) {
                    const managerrole = yield this.roleUtils.getRoleByName('manager');
                    const employeerole = yield this.roleUtils.getRoleByName('employee');
                    var userdata = JSON.parse(body);
                    let importtask = new Promise((resolve, reject) => {
                        userdata.forEach((element, index, array) => __awaiter(this, void 0, void 0, function* () {
                            const user = yield this.userUtils.getUserByEmail(element.Email);
                            let username = element.Name.split(" ");
                            const userobj = {
                                emailconfirmed: true,
                                email: element.Email.toLowerCase(),
                                password: yield utils_1.Utils.encryptText("test@123"),
                                firstname: username[0],
                                lastname: username[1],
                                userrole: mongoose_1.Types.ObjectId(employeerole._id),
                                phone: element.PhoneNumber ? element.PhoneNumber.split(" ")[1] : "",
                                userTypeCode: 1,
                                status: element.Team == 'Resigned' ? 0 : 1,
                                userband: element.Band
                            };
                            if (!user) {
                                const result = yield this.userUtils.createUser(userobj);
                            }
                            else {
                                const result = yield this.userUtils.updateuserDataById(user._id, userobj);
                            }
                            if (index === array.length - 1)
                                resolve();
                        }));
                    });
                    importtask.then(() => {
                        userdata.forEach((element) => __awaiter(this, void 0, void 0, function* () {
                            // console.log('email', element.Email);
                            const user = yield this.userUtils.getUserByEmail(element.Email);
                            const reqArr = [
                                {
                                    $addFields: {
                                        "nameFilter": {
                                            $concat: [
                                                "$firstname",
                                                " ",
                                                "$lastname"
                                            ]
                                        }
                                    }
                                },
                                {
                                    $match: {
                                        nameFilter: {
                                            $regex: element.ReportingManagerName,
                                            $options: "i"
                                        }
                                    }
                                }
                            ];
                            const finalresult = yield this.userUtils.getProfile(reqArr);
                            const userDetails = finalresult[0];
                            if (userDetails) {
                                const userreportobj = {
                                    reporting_manager: mongoose_1.Types.ObjectId(userDetails._id)
                                };
                                const userroleobj = {
                                    userrole: mongoose_1.Types.ObjectId(managerrole._id)
                                };
                                const resultobj = yield this.userUtils.updateuserDataById(user._id, userreportobj);
                                const resultroleobj = yield this.userUtils.updateuserDataById(userDetails._id, userroleobj);
                            }
                        }));
                    });
                    return res.status(200).json({ succeess: 'imported successfully' });
                }
            }));
        });
        this.adfslogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let xml = req.body.wresult;
            if (xml == undefined) {
                return res.status(404).json({ error: "page not found" });
            }
            xml2js.parseString(xml, { mergeAttrs: true }, (err, result) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    throw err;
                }
                const jsonString = JSON.stringify(result, null, 4);
                const json = JSON.parse(jsonString);
                var useremail = 'Sanjay.Santoki@devitpl.com';
                // useremail = json["t:RequestSecurityTokenResponse"]["t:RequestedSecurityToken"][0]['saml:Assertion'][0]["saml:AttributeStatement"][0]["saml:Attribute"][0]["saml:AttributeValue"][0]
                const user = yield this.userUtils.getUserByEmail(useremail);
                if (user !== undefined) {
                    /* let userobj = {
                      _id: user._id,
                      email: user.email,
                      firstname: user.firstname,
                      lastname: user.lastname,
                    } */
                    let token = jwt_1.Jwt.getAuthToken(user.toJSON());
                    res.cookie("token", token);
                    // res.cookie("loginuser", JSON.stringify(userobj));  
                }
                res.redirect(process.env.FRONTHOST);
            }));
        });
        this.backendprogress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const day = new Date("2022-04-20").getDay();
            const current = new Date(); // get current date    
            current.setHours(0, 0, 0, 0);
            const weekstart = current.getDate() - current.getDay() - 6;
            const weekend = weekstart + 6; // end day is the first day + 6 
            const monday = new Date(current.setDate(weekstart));
            const sunday = new Date(current.setDate(weekend));
            const startDate = new Date(monday.getTime() - (monday.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
            const endDate = new Date(sunday.getTime() - (sunday.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
            const reqArr = [
                {
                    $lookup: {
                        from: 'emp_progresses',
                        as: 'empusers',
                        let: { "mainid": "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    // $expr: { /* $eq: ["$emp_id", "$$mainid"], */ "$gt": ["$start_week", new Date("2022-04-04")] },
                                    $expr: {
                                        $and: [
                                            { $eq: ["$emp_id", "$$mainid"] },
                                            { "$eq": ["$start_week", new Date(startDate)] },
                                            { "$eq": ["$end_week", new Date(endDate)] },
                                        ]
                                    }
                                }
                            }
                        ],
                    }
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
                    $match: { 'empusers': [] }
                },
            ];
            const result = yield this.userUtils.getProfile(reqArr);
            /* if (result.length > 0) {
              result.forEach(async element => {
                try {
                  console.log(element.reporting_manager[0].email);
                  const emailData = {
                    "firstname": element.firstname
                  }
                  // const toEmail = [element.email];
                  const toEmail = ['Rajdeep.vaghela@devitpl.com'];
                  let ccEmail = [];
        
                  if (day == 2 || day == 3) {
                    // ccEmail = [element.reporting_manager[0].email];
                    ccEmail = ['shubham.sarvariya@devitpl.com'];
                  }
                  SendEmail.sendRawMail("training-reminder", emailData, toEmail,
                    `Preggress Update Reminder`, "", false, ccEmail);
                } catch (e) {
                  console.log(e);
                }
              });
            } */
            return res.status(200).json({ succeess: 'today is monday', result });
        });
        this.sendtopm = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            const allPM = yield this.userUtils.getAllPM();
            let respArr = [];
            if (allPM.length > 0) {
                try {
                    for (var allPM_1 = __asyncValues(allPM), allPM_1_1; allPM_1_1 = yield allPM_1.next(), !allPM_1_1.done;) {
                        const element = allPM_1_1.value;
                        respArr = yield this.userUtils.getAllReporting(element._id);
                        if (respArr.length > 0) {
                            /* const emailData = {
                              "{firstname}": element.firstname,
                              "{employees}": respArr.toString()
                            };
                            // const toEmail = [element.email];
                            const toEmail = ['Rajdeep.vaghela@devitpl.com'];
                            try{
                            SendEmail.sendRawMail("send-to-pm", emailData, toEmail,
                              `Employee Preggress Reminder`, "", false);
                            } catch (e) {
                              console.log(e);
                            } */
                            return res.status(200).json({ succeess: 'list send to pm', respArr });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (allPM_1_1 && !allPM_1_1.done && (_a = allPM_1.return)) yield _a.call(allPM_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return res.status(200).json({ succeess: 'No PM found' });
        });
        this.trainingprogress = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var e_2, _b;
            const allPM = yield this.userUtils.getAllPM();
            let respArr = [];
            if (allPM.length > 0) {
                try {
                    for (var allPM_2 = __asyncValues(allPM), allPM_2_1; allPM_2_1 = yield allPM_2.next(), !allPM_2_1.done;) {
                        const element = allPM_2_1.value;
                        respArr = yield this.userUtils.getAllEmployeeProgress(element._id);
                        if (respArr.length > 0) {
                            /* const emailData = {
                              "{firstname}": element.firstname,
                              "{usertable}": respArr.join('')
                            };
                            // const toEmail = [element.email];
                            const toEmail = ['Rajdeep.vaghela@devitpl.com'];
                            try{
                              SendEmail.sendRawMail("send-progress-list", emailData, toEmail,
                              `Employee Preggress`, "", false);
                            } catch (e) {
                              console.log(e);
                            } */
                            return res.status(200).json({ succeess: 'preogress send', respArr });
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (allPM_2_1 && !allPM_2_1.done && (_b = allPM_2.return)) yield _b.call(allPM_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            return res.status(200).json({ succeess: 'No PM found' });
        });
        this.assignRole = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const updateRole = yield this.userUtils.assignRoles(req.body);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(updateRole, req.t("SUCCESS"));
            return res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
        this.fetchRolesAndPermissions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("success", req.body);
            const userRolesAndRights = yield this.userUtils.fetchRights({ id: req.body.employee_id });
            console.log("userRolesAndRights", userRolesAndRights);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(userRolesAndRights, req.t("SUCCESS"));
            return res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=userController.js.map