import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { LocationUtils } from "./locationUtils";
import { MessageModule } from "../../../helpers/commonMessage";

export class LocationController {

  private locationUtils: LocationUtils = new LocationUtils();

 
  public getAll = async (req: any, res: Response) => {
    const locationsData: any = await this.locationUtils.getAllLocations(req);
    const response = ResponseBuilder.respSuccess(locationsData, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  }
  
}