"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RightModel = void 0;
const class_validator_1 = require("class-validator");
const model_1 = require("../../../model");
class RightModel extends model_1.Model {
    constructor(body) {
        super();
        const { name, slug, moduleID, status, } = body;
        this.name = name;
        this.slug = slug;
        this.moduleID = moduleID;
        this.status = status;
    }
}
__decorate([
    class_validator_1.IsNotEmpty()
], RightModel.prototype, "name", void 0);
__decorate([
    class_validator_1.IsOptional()
], RightModel.prototype, "slug", void 0);
__decorate([
    class_validator_1.IsOptional()
], RightModel.prototype, "moduleID", void 0);
__decorate([
    class_validator_1.IsOptional()
], RightModel.prototype, "status", void 0);
exports.RightModel = RightModel;
//# sourceMappingURL=rightsModel.js.map