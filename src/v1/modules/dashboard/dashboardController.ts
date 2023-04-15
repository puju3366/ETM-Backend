import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { DashboardUtils } from "./dashboardUtils";
import { TrainingEmp } from '../trainingemployee/trainingempSchema'
import { TimelineUtils } from "../timeline/timelineUtils"
import { Progress } from "../addprogress/progressSchema"
import { Training } from '../training/trainingSchema'
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import bcrypt = require('bcryptjs');
import { MessageModule } from "../../../helpers/commonMessage";
import { request } from "http";
var moment = require('moment'); // require

export class DashboardController {

  private dashboardUtils: DashboardUtils = new DashboardUtils();
  private timelineUtils: TimelineUtils = new TimelineUtils();

  public getTraningName = async (req: any, res: Response) => {
    const dashboardData: any = await this.dashboardUtils.getTraningName(req);
    const response = ResponseBuilder.respSuccess(dashboardData, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  };
  public getTotalvideos = async (req: any, res: Response) => {
    const dashboardData: any = await this.dashboardUtils.totalVideos(req);
    const week: any = await Progress.find({ emp_id: req.body.emp_id, training_id: req.body.training_id }).sort({ createdAt: -1 }).limit(1)
    if (Object.entries(dashboardData).length === 0 || Object.is(dashboardData, null)) {
      const response = {
        Success: "Data not found."
      }
      return res.status(MessageModule.status.ok).json(response);
    }
    const allData = {
      dashboardData: dashboardData,
      start_week: week[0].start_week,
      end_week: week[0].end_week
    }
    const response = ResponseBuilder.respSuccess(allData, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  }
  public dashboard = async (req: any, res: Response) => {
    const dashboardData: any = await TrainingEmp.find({ emp_id: req.params.id });
    var total = 0;

    for (let i = 0; i < dashboardData.length; i++) {
      const totalvideos = await Training.find({ _id: dashboardData[i].training_id })
      total += parseInt(totalvideos[0].no_of_video)
    }
    const trainingVideos: any = await Progress.find({ emp_id: req.params.id })
    // console.log(trainingVideos)
    var completed = 0;
    for (let i = 0; i < trainingVideos.length; i++) {
      completed += parseInt(trainingVideos[i].completed_videos)
    }
    const data = {
      TrainingCount: dashboardData.length,
      TotalVideos: total,
      TotalCompletedVideos: completed,
      progress: Math.round(completed / total * 100)
    }
    const response = ResponseBuilder.respSuccess(data, req.t("SUCCESS"));

    res.status(MessageModule.status.ok).json(response);
  };

  public getWeeksInMonth = async (year, month) => {
    const weeks = [],
      firstDate = new Date(year, month, 1),
      lastDate = new Date(year, month + 1, 0),
      numDays = lastDate.getDate();

    let dayOfWeekCounter = firstDate.getDay();

    for (let date = 1; date <= numDays; date++) {
      if (dayOfWeekCounter === 0 || weeks.length === 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(date);
      dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;
    }

    return weeks
      .filter((w) => !!w.length)
      .map((w) => ({
        start: w[0],
        end: w[w.length - 1],
        dates: w,
      }));
  }

  public graph = async (req: any, res: Response) => {
    var date = new Date();
    var check: any = await this.getWeeksInMonth(date.getFullYear(), date.getMonth())
    var week = [];
    var videos = [];
    for (let i = 0; i < check.length; i++) {
      week.push("Week "+(i + 1))
      var data1 = await Progress.find({ createdAt: { $gte: moment([date.getFullYear(), date.getMonth(), check[i].start + 1]).toISOString(), $lt: moment([date.getFullYear(), date.getMonth(), check[i].end + 1]).toISOString() } })
      var sum = 0;
      if (data1.length === 0) {
        sum = 0;
      } else {
        for (let j = 0; j < data1.length; j++) {
          sum += parseInt(data1[j].completed_videos)
        }
      }
      videos.push(sum)
    }
    console.log(week, videos)
    const resp = {
      x: week,
      y: videos
    }

    const response = ResponseBuilder.respSuccess(resp, req.t("SUCCESS"));

    res.status(MessageModule.status.ok).json(response);
  }

  public getTraningProgress = async (req: any, res: Response) => {
    const dashboarddata: any = await this.dashboardUtils.update(req);
    if (dashboarddata) {
      const response = ResponseBuilder.respSuccess(dashboarddata, req.t("SUCCESS"));
      res.status(dashboarddata.code).json(response);
    } else {
      res.status(MessageModule.status.ok).json(dashboarddata);
    }
  }
}