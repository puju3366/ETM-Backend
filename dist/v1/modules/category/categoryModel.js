"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const model_1 = require("../../../model");
class CategoryModel extends model_1.Model {
    constructor(body) {
        super();
        const { name, status } = body;
        this.name = name;
        this.status = status;
    }
}
exports.CategoryModel = CategoryModel;
//# sourceMappingURL=categoryModel.js.map