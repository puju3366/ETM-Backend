import * as l10n from "jm-ez-l10n";
import { Failure } from "./error";
import { MessageModule } from "./commonMessage";

export class ResponseBuilder {

  public static successMessage(message: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 200;
    rb.message = message;
    return rb;
  }

   public static errorMessage(message?: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 500;
    rb.error = message != null ? message : l10n.t("ERR_INTERNAL_SERVER");
    return rb;
  }

  public static badRequest(message: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 400;
    rb.error = message;
    return rb;
  }

  public static notFound(message: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 404;
    rb.error = message;
    return rb;
  }

  public static data(result?: any, message?: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    rb.code = 200;
    rb.status = true;
    if (result) {
      result.message = message;
    }
    rb.result = result;
    rb.message = message || null;
    return rb;
  }
  public static respError(res: any, err: any): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
    const respObj = {
      'items': [],
      'status': 0,
      'status_code': MessageModule.status.error,
      'message': err,
    };
    switch (err.name) {
      case 'ValidationError':
        let field:any;
        const messageObj = {};
        const messageArr = [];
        for (field in err.errors) {
          if (err.errors[field]) {
            if (process.env.SETVALIDATIONKEY) {
              messageObj[err.errors[field].path] = err.errors[field].message;
            } else {
              messageArr.push(err.errors[field].message);
            }
          }
        }
        respObj.status_code = MessageModule.status.ok;
        if (process.env.SETVALIDATIONKEY) {
          respObj.message = messageObj;
        } else {
          respObj.message = messageArr;
        }
        break;
        default:
        return res.status(500).json(err);
    }
    return res.status(respObj.status_code).json(respObj);
  }
  public static error(err: Failure, message?: string): ResponseBuilder {
    const rb: ResponseBuilder = new ResponseBuilder();
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

  public static getMobileSuccessResponse(result: Json, message?: string): ResponseBuilder {
    const data: any = result;
    let respObj = null;
    if (result) {
      respObj = {
        items: result,
        totalCount: data.data ? data.data.length :result.length,
        status: 1,
        status_code: 200,
        message: message || null
      };
    } else {
      respObj = {
        items: [],
        totalCount: 0,
        status: 1,
        status_code: 200,
        message: "Success"
      }
    }
    return respObj;
  }
  public static respSuccess(result: Json, message?: string): ResponseBuilder {
    const data: any = result;
    let respObj = null;
    if (result) {
      respObj = {
        items: result,
        totalCount: data.data ? data.data.length :result.length,
        status: 1,
        status_code: 200,
        message: message || null
      };
    } else {
      respObj = {
        items: [],
        totalCount: 0,
        status: 1,
        status_code: 200,
        message: "Success"
      }
    }
    return respObj;
  }


  public code: number;
  public message: string;
  public error: string;
  public status: boolean;
  public result: any;
  public description: string;
}
