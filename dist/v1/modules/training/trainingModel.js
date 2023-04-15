"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUpdateModel = exports.TrainingModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class TrainingModel extends model_1.Model {
    constructor(body) {
        super();
        const { trainingname, platform, courselink, focus_area, level, no_of_video, startdate, endate, mentor, status, emp_id } = body;
        this.trainingname = trainingname;
        this.platform = platform;
        this.courselink = courselink;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], TrainingModel.prototype, "trainingname", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], TrainingModel.prototype, "platform", void 0);
__decorate([
    class_validator_1.IsOptional()
], TrainingModel.prototype, "mentor", void 0);
exports.TrainingModel = TrainingModel;
class UserUpdateModel extends model_1.Model {
    constructor(body) {
        super();
        const { trainingname, platform, courselink, focus_area, mentor, } = body;
        this.trainingname = trainingname;
        this.platform = platform;
        this.courselink = courselink;
        this.focus_area = focus_area;
        this.mentor = mentor;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "trainingname", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "platform", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "courselink", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "focus_area", void 0);
__decorate([
    class_validator_1.IsNotEmpty()
], UserUpdateModel.prototype, "mentor", void 0);
exports.UserUpdateModel = UserUpdateModel;
//# sourceMappingURL=trainingModel.js.map