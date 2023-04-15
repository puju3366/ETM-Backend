import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import bcrypt = require('bcryptjs');
import { MessageModule } from "../../../helpers/commonMessage";
import { TrainingEmp } from "../trainingemployee/trainingempSchema";
import { Progress } from '../addprogress/progressSchema';
import { TimelineUtils } from "./timelineUtils";
import { Timeline } from "../timeline/timelineSchema";
import * as nodemailer from "nodemailer";
export class TimelineController {

  private timelineUtils: TimelineUtils = new TimelineUtils();
 public timeline =async (req: any, res: Response) => {
     try {
         const data = await this.timelineUtils.getById(req)
         const response: any = ResponseBuilder.respSuccess(data, req.t("SUCCESS"));
         res.status(response.status_code).json(response);

     } catch (e) {
        res.status(MessageModule.status.error).json(e);
     }
 }
}