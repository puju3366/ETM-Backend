import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { TrainingUtils } from "./trainingUtils";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import bcrypt = require('bcryptjs');
import { MessageModule } from "../../../helpers/commonMessage";
import { Training } from "./trainingSchema";
import { TrainingEmp } from "../trainingemployee/trainingempSchema";
import { Progress } from '../addprogress/progressSchema';
import { TimelineUtils } from "../timeline/timelineUtils";
import { Timeline } from "../timeline/timelineSchema";
import { User } from "../user/userSchema";
import * as nodemailer from "nodemailer";

export class TrainingController {

  private trainingUtils: TrainingUtils = new TrainingUtils();
  private timelineUtils: TimelineUtils = new TimelineUtils();

  /**
   * @method create
   * @description : for Creating training.
   * @param req 
   * @param res 
   * @return JSON object
   * @author  : DEVIT Cloud Team
   * @created : 05/04/2022
   */
  public create = async (req: any, res: Response) => {
    const mydata = req.body;
    const trainingData: any = await this.trainingUtils.create(mydata);
    const response = ResponseBuilder.respSuccess(trainingData, req.t("SUCCESS"));

    if (response) {
      const merge = trainingData.trainingname.charAt(0).toUpperCase() + trainingData.trainingname.slice(1)
      const data = {
        emp_id: req.payload._id,
        training_id: trainingData._id,
        action: merge.bold() + ' ' + "training has been Created.",
      }
      await this.timelineUtils.timeLine(data);
    }
    res.status(MessageModule.status.ok).json(response);
  };

  /**
  * @method getTrainingById
  * @description : Get training details by training id.
  * @param req 
  * @param res 
  * @return JSON object
  * @author  : DEVIT Cloud Team
  * @created : 05/04/2022
  */
  public getTrainingById = async (req: any, res: Response) => {
    try {

      const result: any = await this.trainingUtils.getTraningDetails(req)
      if (Object.entries(result).length === 0) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
      } else {
        const response: any = ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
        res.status(response.status_code).json(response);
      }
    } catch (e) {
      e.message = 'not found';
      res.status(404).send({ e, error: e.message, status: 404 });
    }
  };
  /** 
   * @method edit
   * @description : Edit training details.
   * @param req 
   * @param res 
   */
  public edit = async (req: any, res: Response) => {
    try {
      const _id = req.params.id;
      // const result = await Training.findOne({_id});

      const result: any = await this.trainingUtils.getById(req);
      if (Object.entries(result).length === 0) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
      }
      else {
        const trainingName: any = await Training.find({ _id: req.params.id }).exec();
        const trainingData: any = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true });
        const changedData = await this.getChangedData(trainingName, trainingData)
        var actionData = changedData.toString() + '.';
        const response = ResponseBuilder.respSuccess(trainingData, req.t("SUCCESS"));
        if (response) {
          const data = {
            emp_id: req.payload._id,
            training_id: trainingName[0]._id,
            action: actionData,
          }
          await this.timelineUtils.timeLine(data);
        }
        res.status(MessageModule.status.ok).json(response);
      }
    } catch (e) {
      e.message = 'not found';
      res.status(404).send({ e, error: e.message, status: 404 });
    }
  };
  public getChangedData = async (trainingName, trainingData) => {

    var actioning = [];
    if (trainingName[0].trainingname != trainingData.trainingname) {
      const data = trainingName[0].trainingname + " training name has been renamed to " + trainingData.trainingname.bold() + " ";
      actioning.push(data)
    }
    if (trainingName[0].platform != trainingData.platform) {
      const data = trainingName[0].platform + " platform has been renamed to " + trainingData.platform.bold() + " ";
      actioning.push(data)
    }
    if (trainingName[0].courselink != trainingData.courselink) {
      const data = trainingName[0].courselink + " courselink has been renamed to " + trainingData.courselink + " ";
      actioning.push(data)
    }
    if (trainingName[0].focus_area != trainingData.focus_area) {
      const data = trainingName[0].focus_area + " focusarea has been renamed to " + trainingData.focus_area.bold() + " ";
      actioning.push(data)
    } if (trainingName[0].level != trainingData.level) {
      const data = trainingName[0].level + " level has been renamed to " + trainingData.level.bold() + " ";
      actioning.push(data)
    } if (trainingName[0].no_of_video != trainingData.no_of_video) {
      const data = trainingName[0].no_of_video + " no of vidoes has been updated to " + trainingData.no_of_video.bold() + " ";
      actioning.push(data)
    }
    if (trainingName[0].startdate != trainingData.startdate) {
      const data = trainingName[0].startdate + " start date has been changed to " + trainingData.startdate.bold() + " ";
      actioning.push(data)
    }
    if (trainingName[0].endate != trainingData.endate) {
      const data = trainingName[0].endate + " end date has been changed to " + trainingData.endate.bold() + " ";
      actioning.push(data)
    }
    if (trainingName[0].mentor != trainingData.mentor) {
      const data = "Mentor has been changed for " + trainingName[0].trainingname.bold() + " training";
      actioning.push(data)
    }
    return actioning;
  }
  /** 
   * @method delete
   * @description : delete training.
   * @param req 
   * @param res 
   */
  public delete = async (req: any, res: Response) => {
    try {
      const _id = req.params.id;
      const result: any = await this.trainingUtils.getById(req);
      if (Object.entries(result).length === 0) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
      } else {
        const trainingName: any = await this.trainingUtils.getById(req);
        const result = await Training.deleteOne({ "_id": _id })
        await TrainingEmp.deleteOne({ "training_id": _id })
        await Progress.remove({ "training_id": _id })
        await Timeline.remove({ "training_id": _id })

        const response = ResponseBuilder.respSuccess(result, MessageModule.message.delete)
        if (response) {
          const merge = trainingName[0].trainingname.charAt(0).toUpperCase() + trainingName[0].trainingname.slice(1)

          const data = {
            emp_id: req.payload._id,
            action: merge.bold() + ' ' + "training has been deleted.",
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
  /** 
   * @method getAll
   * @description : Get all the training details for listing.
   * @param req 
   * @param res 
   */
  public getAll = async (req: any, res: Response) => {
    const trainingData: any = await this.trainingUtils.getAllTrainings(req);
    const response = ResponseBuilder.respSuccess(trainingData, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  }

}