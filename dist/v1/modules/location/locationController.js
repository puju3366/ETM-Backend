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
exports.LocationController = void 0;
const responseBuilder_1 = require("../../../helpers/responseBuilder");
const locationUtils_1 = require("./locationUtils");
const commonMessage_1 = require("../../../helpers/commonMessage");
class LocationController {
    constructor() {
        this.locationUtils = new locationUtils_1.LocationUtils();
        this.getAll = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const locationsData = yield this.locationUtils.getAllLocations(req);
            const response = responseBuilder_1.ResponseBuilder.respSuccess(locationsData, req.t("SUCCESS"));
            res.status(commonMessage_1.MessageModule.status.ok).json(response);
        });
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=locationController.js.map