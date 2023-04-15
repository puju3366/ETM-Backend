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
exports.ProgressMiddleware = void 0;
const My = require("jm-ez-mysql");
const tables_1 = require("../../../config/tables");
const utils_1 = require("../../../helpers/utils");
const userSchema_1 = require("../user/userSchema");
const constants_1 = require("../../../config/constants");
const jwt_1 = require("../../../helpers/jwt");
class ProgressMiddleware {
    constructor() {
        this.checkMobileNumberExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let user = [];
            if (req.body.phone) {
                user = yield userSchema_1.User.find({ phone: req.body.phone });
            }
            if (user.length > 0) {
                const resArr = {
                    "items": [],
                    "status": 0,
                    "status_code": 200,
                    "message": {
                        "phone": req.t("ERR_MOBILE_ALREADY_EXISTS")
                    }
                };
                res.status(constants_1.Constants.NOT_FOUND).json(resArr);
            }
            else {
                next();
            }
        });
        this.checkEmailExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let user = [];
            if (req.body.email) {
                user = yield userSchema_1.User.find({ email: req.body.email });
            }
            if (user.length > 0) {
                const resArr = {
                    "items": [],
                    "status": 0,
                    "status_code": 200,
                    "message": {
                        "email": req.t("ERR_EMAIL_ALREADY_EXISTS")
                    }
                };
                res.status(constants_1.Constants.NOT_FOUND).json(resArr);
            }
            else {
                next();
            }
        });
        this.IsUserExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const customer = yield userSchema_1.User.find({ email: req.body.email }).exec();
            if (customer && customer.length > 0) {
                if (!customer[0].emailconfirmed) {
                    res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t("CONFIRM_EMAIL") });
                }
                else {
                    next();
                }
            }
            else {
                res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t("USER_NOT_EXISTS") });
            }
        });
        this.verifyOldPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.body.newPassword !== req.body.confirmPassword) {
                return res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t('CONFIRM_PASSWORD_NOT_MATCH') });
            }
            else {
                const result = yield My.first(tables_1.Tables.USERS, ["password"], "id = ?", [req._user.id]);
                const comparePassword = yield utils_1.Utils.compareEncryptedText(req.body.oldPassword, result.password);
                if (comparePassword) {
                    next();
                }
                else {
                    return res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t('OLD_PASSWORD_WRONG') });
                }
            }
        });
        // Below middleware is for checking if mobile no is registered or not
        this.isMobileRegistered = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield My.first(tables_1.Tables.USERS, ["*"], `mobile = ?`, [req.body.mobile]);
            if (user && user.isBlock === 0) {
                next();
            }
            else if (user.isBlock === 1) {
                res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t("INACTIVE_USER") });
            }
            else {
                res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t("MOBILE_NOT_REGISTERED") });
            }
        });
        this.isEmailRegistered = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield My.first(tables_1.Tables.USERS, ["*"], `email = ?`, [req.body.email]);
            if (user && user.status === 1) {
                next();
            }
            else if (user.status === 0) {
                res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t("INACTIVE_USER") });
            }
            else {
                res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t("EMAIL_NOT_REGISTERED") });
            }
        });
        this.checktoken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { headers: { authorization }, } = req;
            if (authorization && (authorization.split(' ')[0] === 'JWT'
                || authorization.split(' ')[0] === 'Bearer')) {
                const token = jwt_1.Jwt.decodeAuthToken(authorization.split(' ')[1]);
                req.payload = token;
                next();
            }
            else if (req.session && req.session.token) {
                const token = jwt_1.Jwt.decodeAuthToken(req.session.token);
                req.payload = token;
                next();
            }
            else {
                return res.status(401).json({ error: req.t("TOKEN_NOT_FOUND") });
            }
        });
    }
}
exports.ProgressMiddleware = ProgressMiddleware;
//# sourceMappingURL=progressMiddleware.js.map