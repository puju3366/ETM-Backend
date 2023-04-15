import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { CategoryUtils } from "./categoryUtils";
import { MessageModule } from "../../../helpers/commonMessage";

export class CategoryController {

  private categoryUtils: CategoryUtils = new CategoryUtils();

 
  public getAll = async (req: any, res: Response) => {
    const categorysData: any = await this.categoryUtils.getAllLocations(req);
    const response = ResponseBuilder.respSuccess(categorysData, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  }
  
}