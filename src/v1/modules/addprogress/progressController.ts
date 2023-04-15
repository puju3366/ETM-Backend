import { Response } from "express";
import * as _ from "lodash";
import { Types } from "mongoose";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { ProgressUtils } from "./progressUtils";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import { Progress } from "./progressSchema";
import { User } from "../user/userSchema";
import { Training } from "../training/trainingSchema";
import bcrypt = require('bcryptjs');
import { MessageModule } from "../../../helpers/commonMessage";
import { TimelineUtils } from "../timeline/timelineUtils";
import { request } from "http";
const ExcelJS = require('exceljs');


export class ProgressController {
  private progressUtils: ProgressUtils = new ProgressUtils();
  private timelineUtils: TimelineUtils = new TimelineUtils();

  public addProgress = async (req: any, res: Response) => {
    try {
      const employee = await User.findOne({ '_id': req.body.emp_id });
      var training = await Training.findOne({ '_id': req.body.training_id });
      if (Object.is(employee, null) || Object.is(training, null)) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
        return false;
      }
      const progress: any = await this.progressUtils.create(req.body);
      var start = new Date(progress.start_week);
      const startWeek = start.toISOString().substring(0, 10);
      var end = new Date(progress.end_week);
      const endWeek = end.toISOString().substring(0, 10);
      const response = ResponseBuilder.respSuccess(progress, req.t("SUCCESS"));
      if (response) {
        const data = {
          emp_id: req.payload._id,
          trainig_id: training._id,
          action: "You have completed " + progress.completed_videos + " videos for " + training.trainingname + ' training (' + startWeek + ' to ' + endWeek + ')',

        }
        await this.timelineUtils.timeLine(data);
      }
      res.status(MessageModule.status.ok).json(response);
    } catch (e) {
      res.status(MessageModule.status.error).json(e);
    }
  }
  public viewProgress = async (req: any, res: Response) => {
    try {
      const reqArr = [
        {
          $match: {
            'emp_id': Types.ObjectId(req.body.emp_id),
            'training_id': Types.ObjectId(req.body.training_id),
          }
        },
        {
          $project: {
            start_week: 1,
            end_week: 1,
            completed_videos: 1
          }
        }

      ];
      const progress = await Progress.aggregate(reqArr).exec();
      if (Object.is(progress, null)) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
        return false;
      }
      const response = ResponseBuilder.respSuccess(progress, req.t("SUCCESS"));
      res.status(MessageModule.status.ok).json(response);
    } catch (e) {
      res.status(MessageModule.status.error).json(e);
    }

  }

  public getTrainingDetails = async (req: any, res: Response) => {
    const dashboardData: any = await this.progressUtils.getTraningNameById(req);
    const startWeeklength = dashboardData[0].startweek.length;
    const endWeeklength = dashboardData[0].endweek.length;
    let startweek = dashboardData[0].startweek[startWeeklength - 1];
    let endweek = dashboardData[0].endweek[endWeeklength - 1];
    const data = {
      dashboardData: dashboardData,
      start_week: startweek,
      end_week: endweek
    }
    const response = ResponseBuilder.respSuccess(data, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  }

  public viewUserProgress = async (req: any, res: Response) => {
    try {
      const reqArr = [
        {
          $match: {
            'emp_id': Types.ObjectId(req.params.id),
          }
        },
        {
          $lookup: {
            from: 'trainings',
            localField: 'training_id',
            foreignField: '_id',
            as: 'training'
          },
        },
        {
          $project: {
            start_week: 1,
            end_week: 1,
            completed_videos: 1,
            'training.trainingname': 1,
            'training.level': 1
          }
        },
        { $sort: { 'training.trainingname': 1 } }
      ];
      const progress = await Progress.aggregate(reqArr).exec();
      if (Object.is(progress, null)) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
        return false;
      }
      const response = ResponseBuilder.respSuccess(progress, req.t("SUCCESS"));
      res.status(MessageModule.status.ok).json(response);
    } catch (e) {
      res.status(MessageModule.status.error).json(e);
    }

  }

  public exportUserProgress = async (req: any, res: Response) => {
    try {
      const user = await this.userRecursive(req.params.id);
      if (Object.is(user, null)) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
        return false;
      }
      const response = ResponseBuilder.respSuccess(user, req.t("SUCCESS"));
      res.status(MessageModule.status.ok).json(response);
    } catch (e) {
      res.status(MessageModule.status.error).json(e);
    }

  }

  public async userRecursive(id: any) {
    const reqArr = [
      {
        $match: {
          'reporting_manager': Types.ObjectId(id)
        }
      },
    ];
    const progress = await User.aggregate(reqArr).exec();
    const cnt = progress.length;
    var user: any = '';
    if (cnt > 0) {
      progress.forEach(async (row: any) => {
        // user += row.firstname + "\n";
        const ids = row._id.toString();
        user += await this.userRecursive(ids);
      });
    };
    return user;
  }


}