"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseBuilder = void 0;
const l10n = require("jm-ez-l10n");
const commonMessage_1 = require("./commonMessage");
class ResponseBuilder {
    static successMessage(message) {
        const rb = new ResponseBuilder();
        rb.code = 200;
        rb.message = message;
        return rb;
    }
    static errorMessage(message) {
        const rb = new ResponseBuilder();
        rb.code = 500;
        rb.error = message != null ? message : l10n.t("ERR_INTERNAL_SERVER");
        return rb;
    }
    static badRequest(message) {
        const rb = new ResponseBuilder();
        rb.code = 400;
        rb.error = message;
        return rb;
    }
    static notFound(message) {
        const rb = new ResponseBuilder();
        rb.code = 404;
        rb.error = message;
        return rb;
    }
    static data(result, message) {
        const rb = new ResponseBuilder();
        rb.code = 200;
        rb.status = true;
        if (result) {
            result.message = message;
        }
        rb.result = result;
        rb.message = message || null;
        return rb;
    }
    static respError(res, err) {
        const rb = new ResponseBuilder();
        const respObj = {
            'items': [],
            'status': 0,
            'status_code': commonMessage_1.MessageModule.status.error,
            'message': err,
        };
        switch (err.name) {
            case 'ValidationError':
                let field;
                const messageObj = {};
                const messageArr = [];
                for (field in err.errors) {
                    if (err.errors[field]) {
                        if (process.env.SETVALIDATIONKEY) {
                            messageObj[err.errors[field].path] = err.errors[field].message;
                        }
                        else {
                            messageArr.push(err.errors[field].message);
                        }
                    }
                }
                respObj.status_code = commonMessage_1.MessageModule.status.ok;
                if (process.env.SETVALIDATIONKEY) {
                    respObj.message = messageObj;
                }
                else {
                    respObj.message = messageArr;
                }
                break;
            default:
                return res.status(500).json(err);
        }
        return res.status(respObj.status_code).json(respObj);
    }
    static error(err, message) {
        const rb = new ResponseBuilder();
        if (err instanceof ResponseBuilder) {
            return err;
        }
        rb.code = 500;
        rb.error = err || l10n.t("ERR_INTERNAL_SERVER");
        rb.message = message || null;
        rb.description = err.description;
        rb.result = err ? l10n.t("ERR_THROW_BY_CODE") : l10n.t("ERR_INTERNAL_SERVER");
        return rb;
    }
    static getMobileSuccessResponse(result, message) {
        const data = result;
        let respObj = null;
        if (result) {
            respObj = {
                items: result,
                totalCount: data.data ? data.data.length : result.length,
                status: 1,
                status_code: 200,
                message: message || null
            };
        }
        else {
            respObj = {
                items: [],
                totalCount: 0,
                status: 1,
                status_code: 200,
                message: "Success"
            };
        }
        return respObj;
    }
    static respSuccess(result, message) {
        const data = result;
        let respObj = null;
        if (result) {
            respObj = {
                items: result,
                totalCount: data.data ? data.data.length : result.length,
                status: 1,
                status_code: 200,
                message: message || null
            };
        }
        else {
            respObj = {
                items: [],
                totalCount: 0,
                status: 1,
                status_code: 200,
                message: "Success"
            };
        }
        return respObj;
    }
}
exports.ResponseBuilder = ResponseBuilder;
//# sourceMappingURL=responseBuilder.js.map