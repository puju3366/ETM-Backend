"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationModel = void 0;
const model_1 = require("../../../model");
class LocationModel extends model_1.Model {
    constructor(body) {
        super();
        const { name, status } = body;
        this.name = name;
        this.status = status;
    }
}
exports.LocationModel = LocationModel;
//# sourceMappingURL=locationModel.js.map