import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { TrainingEmpUtils } from "./trainingempUtils";
import { Training } from "../training/trainingSchema";
import { Types } from "mongoose";
import { TrainingEmp } from "./trainingempSchema";
import { User } from "../user/userSchema";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import bcrypt = require('bcryptjs');
import { MessageModule } from "../../../helpers/commonMessage";
import * as nodemailer from "nodemailer";
import { Platform } from "../platform/platformSchema";
import { TimelineUtils } from "../timeline/timelineUtils";
import { Progress } from '../addprogress/progressSchema'
import { camelCase } from "lodash";
export class TrainingEmpController {

  private trainingUtils: TrainingEmpUtils = new TrainingEmpUtils();
  private timelineUtils: TimelineUtils = new TimelineUtils();

  /**
   * @method linkEmployee
   * @description: for linking the employe in the specific trainings.
   * @param req 
   * @param res 
   */
  public linkEmployee = async (req: any, res: Response) => {
    const check: any = await TrainingEmp.findOne({ training_id: req.body.training_id });
    var training: any = await Training.findOne({ _id: req.body.training_id });
    // return false;
    if (Object.is(check, null)) {
      const trainingData: any = await this.trainingUtils.create(req.body);

      var response = ResponseBuilder.respSuccess(trainingData, req.t("SUCCESS"));
      if (response) {
        const data = {
          emp_id: req.payload._id,
          training_id: training._id,
          action: "Employee assigned to " + training.trainingname.bold() + " training.",
        }
        await this.timelineUtils.timeLine(data);
      }
      for (let i = 0; i < req.body.emp_id.length; i++) {
        const data = {
          emp_id: req.body.emp_id[i],
          training_id: training._id,
          action: "You are assigned to " + training.trainingname.bold() + " training.",
        }
        await this.timelineUtils.timeLine(data);
      }
    } else {
      // const emp = [... new Set(req.body.emp_id)]

      const trainingEmp: any = await TrainingEmp.findOne({ training_id: req.body.training_id });
      const output = req.body.emp_id.filter(function (obj) {
        return trainingEmp.emp_id.indexOf(obj) !== -1;
      });
      var arr = []
      if (output.length > 0) {
        for (let i = 0; i < output.length; i++) {
          const match = await User.findOne({ _id: output[i] })
          arr.push(match.firstname + ' ' + match.lastname)
        }
        const resp = {
          msg: arr.toString() + " alreay assigned to this training."
        }
        return res.status(409).json(resp);
      }

      if (trainingEmp.emp_id.filter(element => req.body.emp_id.includes(element))) {
      }
      const data: any = await TrainingEmp.findByIdAndUpdate({ _id: trainingEmp._id }, { $push: { emp_id: req.body.emp_id } }, { new: true });
      var response = ResponseBuilder.respSuccess(data, req.t("SUCCESS"));
      if (response) {
        const data = {
          emp_id: req.payload._id,
          training_id: training._id,
          action: "Employee linked in " + training.trainingname.bold() + " training.",
        }
        await this.timelineUtils.timeLine(data);
      }
      for (let i = 0; i < req.body.emp_id.length; i++) {
        const data = {
          emp_id: req.body.emp_id[i],
          training_id: training._id,
          action: "You are assigned to " + training.trainingname.bold() + " training.",
        }
        await this.timelineUtils.timeLine(data);
      }
    }
    res.status(MessageModule.status.ok).json(response);
  }
  public notifyParticipants = async (req: any, res: Response) => {
    try {
      const reqArr = [
        {
          $match: {
            'training_id': Types.ObjectId(req.body.training_id)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'emp_id',
            foreignField: '_id',
            as: 'employee'
          },
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
          $lookup: {
            from: 'users',
            localField: 'training.mentor',
            foreignField: '_id',
            as: 'mentor'
          },
        },
        {
          $project: {
            employee: '$employee.email',
            mentor: '$mentor.email'
          }
        }
      ]
      const data1 = await TrainingEmp.aggregate(reqArr).exec();
      console.log(Object.is(data1, null) || data1 === [] || data1.length === 0 || data1[0].employee.length === 0)
      if (Object.is(data1, null) || data1 === [] || data1.length === 0 || data1[0].employee.length === 0) {
        const response = { 'error': 'Employee Not linked to this training!!' };
        return res.status(MessageModule.status.not_found).json(response);
      } else {
        var TrainingName = await Training.find({ _id: req.body.training_id })
        const response = { 'Success': 'Email sent successfully' };
        var emails = data1[0].employee
        var mentor = data1[0].mentor
        const emailsttsus = this.sendEmail(emails, mentor, TrainingName);
        if (response) {
          const data = {
            emp_id: req.payload._id,
            action: "Email has been sent to respected employees and mentors for " + TrainingName[0].trainingname.bold() + ' training.',
          }
          await this.timelineUtils.timeLine(data);
        }
        if (!emailsttsus) {
          const response = { 'error': 'something went wrong' }
        }
        res.status(MessageModule.status.ok).json(response);
      }
    } catch (e) {
    }
  }

  /**
   * @method sendEmail
   * @description: for send mail when employee link to the specific training.
   * @param emails   
   * @param mentor 
   */
  public sendEmail = async (emails, mentor, data) => {
    console.log(data[0].trainingname, data[0].courselink, data[0].platform, data[0].startdate, data[0].endate, data[0].focus_area);
    let a = mentor
    let mentorCopy = a;
    let toAbstractName = [];
    mentorCopy.forEach(myfunction)
    function myfunction(item, index) {
      let a1 = item.replace("@devitpl.com", "")
      let b = a1.replace(".", " ")
      console.log(b.charAt(0).toUpperCase() + b.slice(1) + " (" + item + ")")
      toAbstractName.push(b.charAt(0).toUpperCase() + b.slice(1) + " (" + item + ") ")
    }
    let html = "";
    // html = '<style> table, th, td {border: 1px solid black;} </style> <div style="padding:20px;color:#3b3b3b;"> Hi, You are assigned to new training the training details are listed below.</div> <br> <br> <table "class="table">  <tr><th> Training name </th> <th>' +  data[0].trainingname + '</th></tr> <tr> <th> Platform </th> <th>' + data[0].platform + '</th> </tr> <tr> <th>Focus Area </th>   <th>' + data[0].focus_area + ' </th> </tr> <tr> <th>Courselink </th>   <th>' + data[0].courselink + ' </th> </tr> <tr> <th>Startdate </th>  <th>' + data[0].startdate + ' </th> </tr> <tr> <th>Enddate </th>   <th>' + data[0].endate + ' </th> </tr> <tr> <th>Mentors </th>  <th>' + mentor.toString() + ' </th> </tr> </table> <br> <br> <div> Please contact your respective mentors if any doubts or query.</div>';
    html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml" lang="en">
      <head><link rel="stylesheet" type="text/css" hs-webfonts="true" href="https://fonts.googleapis.com/css?family=Lato|Lato:i,b,bi">
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <title>Email template</title>
        <meta property="og:title" content="Email template">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style type="text/css">
          a{ 
            text-decoration: underline;
            color: inherit;
            font-weight: bold;
            color: #253342;
          }
          h1 {
            font-size: 56px;
          }
            h2{
            font-size: 28px;
            font-weight: 900; 
          }
          p {
            font-weight: 100;
          }
          #email {
            margin: auto;
            width: 600px;
            background-color: white;
          }
          table{
            border: 1px solid gray;
            height:
            align:center;
          }
          tr{
            border-top: 1px solid gray;
          }
          td{
          }
          .container{
            align:center;
          }
          button{
            font: inherit;
            background-color: #FF7A59;
            border: none;
            padding: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 900; 
            color: white;
            border-radius: 5px; 
            box-shadow: 3px 3px #d94c53;
          }
          .subtle-link {
            font-size: 9px; 
            text-transform:uppercase; 
            letter-spacing: 1px;
            color: #CBD6E2;
          }
          .connect-image{
              height:30px;
              width:30px;
          }
        </style>
      </head>
        <body bgcolor="#F5F8FA" style="width: 100%; margin: auto 0; padding:0; font-family:Lato, sans-serif; font-size:18px; color:#33475B; word-break:break-word">
        <div class="container" > Hi, You are assigned to new training the training details are listed below.</div>
         <br> <br> 
         <table class="table table-striped" style="width:70%"> 
      <tr style="background:#b3b3b3;color:black;">
          <th scope="row" style="text-align:left; padding-left:25px;vertical-align: center;width:20%"> Training name </th> 
          <td style="text-align:center;vertical-align: center;width:80%">   ${data[0].trainingname}  </th>
      </tr>
      <tr>
           <th scope="row" style="text-align:left; padding-left:25px;vertical-align: center;width:20%"> Platform </th>
           <td style="text-align:center;vertical-align: center;width:80%">  ${data[0].platform} </th> 
      </tr>
      <tr style="background:#b3b3b3;color:black;">
             <th style="text-align:left; padding-left:25px;vertical-align: center;width:20%" scope="row">Focus Area </th> 
             <td style="text-align:center;vertical-align: center;width:80%">  ${data[0].focus_area}   </th>      
      </tr>
      <tr> 
          <th style="text-align:left; padding-left:25px;vertical-align: center;width:20%" scope="row">Course link </th> 
           <td style="text-align:center;vertical-align: center;width:80%">  ${data[0].courselink}   </th>      
      </tr>    
      <tr style="background:#b3b3b3;color:black;">
           <th style="text-align:left; padding-left:25px;vertical-align: center;width:20%" scope="row">Start Date </th> 
           <td style="text-align:center;vertical-align: center;width:80%">  ${data[0].startdate}   </th>      
      </tr> 
      <tr> 
          <th style="text-align:left; padding-left:25px;vertical-align: center;width:20%" scope="row">End Date </th> 
          <td style="text-align:center;vertical-align: center;width:80%">  ${data[0].endate}   </th>
      </tr> 
      <tr style="background:#b3b3b3;color:black;"> 
          <th style="text-align:left; padding-left:25px;vertical-align: center;width:20%" scope="row">Mentors </th> 
           <td style="text-align:center;vertical-align: center;width:80%">  ${toAbstractName.toString()}   </th>
      </tr>
 </table>
            <br> <br> 
            <div> Please contact your respective mentors if any doubts or query.</div>
        </body>
          </html>`;
    const mailOptions = {
      from: process.env.DEFAULT_FROM,
      html: html,
      replyTo: process.env.DEFAULT_REPLY_TO,
      subject: "You are assigned to new training.",
      // to: !isPersonalEmail ? emails : [],

      to: emails,
      cc: mentor
      // bcc: isPersonalEmail ? emails : [],
      // text,
    };

    let transportObj = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      },
      secure: false,
    };
    const transporter = nodemailer.createTransport(transportObj);

    transporter.sendMail(mailOptions, (mailSendErr: any, info: any) => {

    });
  }
  /**
   * @method getEmployee
   * @description : for get emplopyee details by training id.
   * @param req 
   * @param res 
   */
  public getEmployee = async (req: any, res: Response) => {
    const employee: any = await TrainingEmp.aggregate([

      {
        "$match": { "training_id": Types.ObjectId(req.body.id) }
      },
      {
        "$lookup": {
          "from": 'users',
          "localField": 'emp_id',
          "foreignField": '_id',
          "as": 'Company'
        }
      },

    ])

    const trainingData: any = await this.trainingUtils.getAll(req);
    const response = ResponseBuilder.respSuccess(employee, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  }
  /**
   * @method getEmployee
   * @description : for get all emplopyee details .
   * @param req 
   * @param res 
   */
  public getEmployeeall = async (req: any, res: Response) => {
    const employee: any = await TrainingEmp.aggregate([

      {
        "$lookup": {
          "from": 'users',
          "localField": 'emp_id',
          "foreignField": '_id',
          "as": 'Company'
        }
      },

    ])
    const trainingData: any = await this.trainingUtils.getAll(req);
    const response = ResponseBuilder.respSuccess(employee, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  }
  /**
   * @method deleteEmployee
   * @description : for delete employee from specific training.
   * @param req 
   * @param res 
   */
  public deleteEmployee = async (req: any, res: Response) => {
    var TrainingEmploye: any = await TrainingEmp.findOne({ training_id: req.body.training_id });
    var employee: any = await User.findOne({ _id: req.body.emp_id });
    var training: any = await Training.findOne({ _id: req.body.training_id });
    const resp = {
      success: 'employee deleted sucessfully'
    }
    const data = await TrainingEmp.updateOne({ _id: TrainingEmploye._id }, { $pull: { emp_id: req.body.emp_id } })
    if (data) {
      await Progress.remove({ training_id: req.body.training_id, emp_id: req.body.emp_id })
    }
    const response = ResponseBuilder.respSuccess(resp, req.t("SUCCESS"));
    if (response) {
      const name = employee.firstname + ' ' + employee.lastname;
      const timeline = {
        emp_id: req.payload._id,
        action: name.bold() + ' has been deleted from ' + training.trainingname.bold() + " training.",
      }
      await this.timelineUtils.timeLine(timeline);
    }
    res.status(MessageModule.status.ok).json(response);
  }
  public progressDataByTrainingemp = async (req: any, res: Response) => {
    var totalVideos = await Training.find({ _id: req.body.training_id });
    const trainingVideos: any = await Progress.find({ emp_id: req.body.emp_id, training_id: req.body.training_id })
    var sum = 0;
    for (let i = 0; i < trainingVideos.length; i++) {
      sum += parseInt(trainingVideos[i].completed_videos)
    }
    var pendingVideos = parseInt(totalVideos[0].no_of_video) - sum;
    var progress = Math.round(sum / parseInt(totalVideos[0].no_of_video) * 100)
    const data = {
      TotalVideos: parseInt(totalVideos[0].no_of_video),
      TotalCompletedVideos: sum,
      pendingVideos: pendingVideos,
      progress: progress,
      ProgressTimeline: trainingVideos,
      TotalvideosPecentage: 100 - progress
    }
    const response = ResponseBuilder.respSuccess(data, req.t("SUCCESS"));

    res.status(MessageModule.status.ok).json(response);
  }

  public Dashboard = async (req: any, res: Response) => {
    try {
      const trainingCount: any = await Training.countDocuments();
      const platformCount: any = await Platform.countDocuments();
      const userCount: any = await User.countDocuments();
      var TrainingEmploye: any = await TrainingEmp.find({}).distinct('emp_id');

      const data = {
        trainingCount: trainingCount,
        platformCount: platformCount,
        userCount: userCount,
        emplopyeeCount: TrainingEmploye.length
      }
      const response = ResponseBuilder.respSuccess(data, req.t("SUCCESS"));
      res.status(MessageModule.status.ok).json(response);
    } catch (e) {
      res.status(MessageModule.status.error).json(e);
    }
  }

}