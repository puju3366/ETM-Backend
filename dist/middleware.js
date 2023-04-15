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
exports.Middleware = void 0;
const l10n = require("jm-ez-l10n");
const My = require("jm-ez-mysql");
const _ = require("lodash");
const jwt_1 = require("./helpers/jwt");
const tables_1 = require("./config/tables");
const user_1 = require("./helpers/user");
const constants_1 = require("./config/constants");
class Middleware {
    constructor() {
        this.user = new user_1.User();
        this.getUserAuthorized = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers.authorization;
            if (authorization && !_.isEmpty(authorization)) {
                try {
                    const tokenInfo = jwt_1.Jwt.decodeAuthToken(authorization.toString());
                    if (tokenInfo) {
                        // query
                        const user = yield My.first(tables_1.Tables.USERS, ["id", "firstName", "lastName", "email", "mobile", "roleId", "isLogin", "deviceId", "isBlock"], "id = ?", [tokenInfo.userId]);
                        if (user) {
                            if (user.isBlock) {
                                return res.status(401).json({ error: req.t("INACTIVE_USER") });
                            }
                            else if (user.isLogin === 1) {
                                if (user.deviceId === tokenInfo.deviceId) {
                                    req._user = user;
                                    next();
                                }
                                else {
                                    res.status(401).json({ error: l10n.t("ERR_UNAUTH") });
                                    return;
                                }
                            }
                            else {
                                res.status(412).json({ error: l10n.t("USER_NOT_VERIFIED") });
                                return;
                            }
                        }
                        else {
                            res.status(401).json({ error: l10n.t("ERR_UNAUTH") });
                            return;
                        }
                    }
                    else {
                        res.status(401).json({ error: l10n.t("ERR_UNAUTH") });
                        return;
                    }
                }
                catch (error) {
                    res.status(500).json({ error: l10n.t("ERR_INTERNAL_SERVER") });
                    return;
                }
            }
            else {
                if (req.path.includes('guest')) {
                    next();
                }
                else {
                    res.status(401).json({ error: l10n.t("ERR_UNAUTH") });
                    return;
                }
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
        this.checkrecordexists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if ((id && id.hasOwnProperty('_id') || id.hasOwnProperty('id')) ?
                (id.hasOwnProperty('_id') ? id._id : id.id) : (req.body._id || req.body.id)) {
                next();
            }
            else {
                return res.status(constants_1.Constants.NOT_FOUND).json({ error: req.t("USER_NOT_EXISTS") });
            }
        });
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=middleware.js.map