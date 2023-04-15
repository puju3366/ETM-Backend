"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class ProgressModel extends model_1.Model {
    constructor(body) {
        super();
        const { training_id, emp_id, } = body;
        this.training_id = training_id;
        this.emp_id = emp_id;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], ProgressModel.prototype, "training_id", void 0);
exports.ProgressModel = ProgressModel;
//# sourceMappingURL=progressModel.js.map