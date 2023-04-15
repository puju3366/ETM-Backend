"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.IsMediaSizeValidConstraint = exports.IsMobileAlreadyExistConstraint = exports.IsEmailAlreadyExistConstraint = void 0;
const class_validator_1 = require("class-validator");
const My = require("jm-ez-mysql");
const constants_1 = require("../../../config/constants");
const tables_1 = require("../../../config/tables");
let IsEmailAlreadyExistConstraint = class IsEmailAlreadyExistConstraint {
    validate(email, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield My.first(tables_1.Tables.USERS, ["id"], "email = ?", [email]);
            if (user) {
                return false;
            }
            else {
                return true;
            }
        });
    }
};
IsEmailAlreadyExistConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: true })
], IsEmailAlreadyExistConstraint);
exports.IsEmailAlreadyExistConstraint = IsEmailAlreadyExistConstraint;
class IsMobileAlreadyExistConstraint {
    validate(mobile, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield My.first(tables_1.Tables.USERS, ["id"], "mobile = ?", [mobile]);
            if (user) {
                return false;
            }
            else {
                return true;
            }
        });
    }
}
exports.IsMobileAlreadyExistConstraint = IsMobileAlreadyExistConstraint;
//validatior classes added by the sync code
let IsMediaSizeValidConstraint = class IsMediaSizeValidConstraint {
    validate(file, args) {
        return file.size < constants_1.Constants.UPLOAD_SIZES.PROFILE_PICTURE;
    }
};
IsMediaSizeValidConstraint = __decorate([
    class_validator_1.ValidatorConstraint({ async: false })
], IsMediaSizeValidConstraint);
exports.IsMediaSizeValidConstraint = IsMediaSizeValidConstraint;
//# sourceMappingURL=progressValidator.js.map