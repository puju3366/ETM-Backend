 import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { FocusareaUtils } from "./focusareaUtils";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import bcrypt = require('bcryptjs');
import { MessageModule } from "../../../helpers/commonMessage";
import { request } from "http";
import { Focusarea } from "./focusareaSchema";
import { Timeline } from "../timeline/timelineSchema";
import { TimelineUtils } from "../timeline/timelineUtils";

export class FocusAreaController {  
  private focusaraeaUtils: FocusareaUtils = new FocusareaUtils();
  private timelineUtils: TimelineUtils = new TimelineUtils();

    public create = async (req:any, res:Response) => {
        try {
            const mydata = req.body;
            const platform: any = await this.focusaraeaUtils.create(mydata);
            const response = ResponseBuilder.respSuccess(platform, req.t("SUCCESS"));
            if (response) {
              const data = {
                emp_id : req.payload._id,
                action :  platform.focus_area+ ' ' +"Focus area has been Created.",
              }
              await this.timelineUtils.timeLine(data);
            }
            res.status(MessageModule.status.ok).json(response);
        } catch (e) {
            res.status(MessageModule.status.error).json(e);
        }
    }
    public edit = async (req: any, res: Response) => {
        try {
          const result: any = await this.focusaraeaUtils.getById(req);
          if (Object.is(result, null)) {
            const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
            res.status(MessageModule.status.not_found).json(response);
          }
          else {
           const focusarea: any = await this.focusaraeaUtils.getById(req);

            const platformData: any = await Focusarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
           const afterfocusarea: any = await this.focusaraeaUtils.getById(req);
            const response = ResponseBuilder.respSuccess(platformData, req.t("SUCCESS"));
            if (response) {
              const data = {
                emp_id : req.payload._id,
                action : focusarea[0].focus_area+ " "+ "focus area has been edited to "+  afterfocusarea[0].focus_area + ".",
              }
              await this.timelineUtils.timeLine(data);
            }
            res.status(MessageModule.status.ok).json(response);
          }
        } catch (e) {
            res.status(MessageModule.status.error).json(e);
        }
      };
    public delete =async (req: any, res: Response) => {
        try {
            const _id = req.params.id;
            var result: any = await this.focusaraeaUtils.getById(req);
            if (Object.is(result, null)) {
              const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
              res.status(MessageModule.status.not_found).json(response);
            } else {
              const deleted = await Focusarea.deleteOne({ "_id": _id })
              const response = ResponseBuilder.respSuccess(deleted, MessageModule.message.delete)
              if (response) {
                const data = {
                  emp_id : req.payload._id,
                  action : result[0].focus_area+ " "+ "focus area has been deleted",
                }
                await this.timelineUtils.timeLine(data);
              }
              res.status(MessageModule.status.ok).json(response);
            }
          } catch (e) {
            e.message = 'not found';
            res.status(404).send({ e, error: e.message, status: 404 });
          }
    }
    public getAll =async (req: any, res: Response) => {
        try {
            const _id = req.params.id;
            const result: any = await Focusarea.find({}).sort({'createdAt': -1})
              const response = ResponseBuilder.respSuccess(result, req.t("SUCCESS"))
              res.status(MessageModule.status.ok).json(response);
            } catch (e) {
            res.status(MessageModule.status.error).json(e);
          }
    }
    public getById = async (req: any, res: Response) => {
      try {
        const result: any = await Focusarea.find({_id:req.params.id})
          const response = ResponseBuilder.respSuccess(result, req.t("SUCCESS"))
          res.status(MessageModule.status.ok).json(response);
        } catch (e) {
        res.status(MessageModule.status.error).json(e);
      }
    }
}