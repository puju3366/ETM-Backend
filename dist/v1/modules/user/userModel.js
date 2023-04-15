"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyOtpModel = exports.ChangePasswordModel = exports.ResetPasswordModel = exports.LoginModel = exports.ForgotPasswordModel = exports.UserUpdateModel = exports.UserModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class UserModel extends model_1.Model {
    constructor(body) {
        super();
        const { firstname, lastname, email, password, userTypeCode, mobileNo } = body;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.userTypeCode = userTypeCode;
        this.mobileNo = mobileNo;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "firstname", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "lastname", void 0);
__decorate([
    class_validator_1.IsEmail({}, { message: "EMAIL_INVALID" }),
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "mobileNo", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "password", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserModel.prototype, "userTypeCode", void 0);
__decorate([
    class_validator_1.IsOptional()
], UserModel.prototype, "status", void 0);
exports.UserModel = UserModel;
class UserUpdateModel extends model_1.Model {
    constructor(body) {
        super();
        const { firstname, lastname, email, phone } = body;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.phone = phone;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "firstname", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "lastname", void 0);
__decorate([
    class_validator_1.IsEmail({}, { message: "EMAIL_INVALID" }),
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "phone", void 0);
exports.UserUpdateModel = UserUpdateModel;
class ForgotPasswordModel extends model_1.Model {
    constructor(body) {
        super();
        const { email, } = body;
        this.email = email;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ForgotPasswordModel.prototype, "email", void 0);
exports.ForgotPasswordModel = ForgotPasswordModel;
class LoginModel extends model_1.Model {
    constructor(body) {
        super();
        const { email, password, deviceId, deviceToken } = body;
        this.email = email;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], LoginModel.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], LoginModel.prototype, "password", void 0);
exports.LoginModel = LoginModel;
class ResetPasswordModel extends model_1.Model {
    constructor(body) {
        super();
        const { password, confirmPassword, } = body;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ResetPasswordModel.prototype, "password", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ResetPasswordModel.prototype, "confirmPassword", void 0);
exports.ResetPasswordModel = ResetPasswordModel;
class ChangePasswordModel extends model_1.Model {
    constructor(body) {
        super();
        const { oldPassword, Password, confirmPassword } = body;
        this.Password = Password;
        this.confirmPassword = confirmPassword;
        this.oldPassword = oldPassword;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ChangePasswordModel.prototype, "Password", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ChangePasswordModel.prototype, "confirmPassword", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], ChangePasswordModel.prototype, "oldPassword", void 0);
exports.ChangePasswordModel = ChangePasswordModel;
class VerifyOtpModel extends model_1.Model {
    constructor(body) {
        super();
        const { otp } = body;
        this.otp = otp;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], VerifyOtpModel.prototype, "otp", void 0);
exports.VerifyOtpModel = VerifyOtpModel;
//# sourceMappingURL=userModel.js.map