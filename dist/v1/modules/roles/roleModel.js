"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateModel = exports.RoleModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class RoleModel extends model_1.Model {
    constructor(body) {
        super();
        const { rolename, isactive, rights, status, } = body;
        this.rolename = rolename;
        this.isactive = isactive;
        this.rights = rights;
        this.status = status;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], RoleModel.prototype, "rolename", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], RoleModel.prototype, "rights", void 0);
__decorate([
    class_validator_1.IsOptional()
], RoleModel.prototype, "isactive", void 0);
__decorate([
    class_validator_1.IsOptional()
], RoleModel.prototype, "status", void 0);
exports.RoleModel = RoleModel;
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
//# sourceMappingURL=roleModel.js.map