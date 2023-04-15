import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { UserUtils } from "./userUtils";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import bcrypt = require('bcryptjs');
import { MessageModule } from "../../../helpers/commonMessage";
import { User } from "./userSchema";
import { RoleUtils } from "../roles/roleUtils";
import { Types } from "mongoose";
var request = require('request');
const xml2js = require("xml2js");


export class UserController {

  private userUtils: UserUtils = new UserUtils();
  private roleUtils: RoleUtils = new RoleUtils();

  public signup = async (req: any, res: Response) => {
    const input = req.body;
    input.password = await Utils.encryptText(input.password);
    input.emailHash = bcrypt.hashSync(input.email, 12);
    const result: any = await this.userUtils.createUser(input);
    if (result && result._id) {
      const objData: any = result;
      delete objData.password;
      const reverseIdObj = { 'token': Utils.reverseString(objData._id.toString()) };
      const token = Jwt.getAuthToken(reverseIdObj);
      const url = process.env.VERIFYACCOUNT + token;
      const userDetails = result;
      const emailData = {
        "verify_link": url,
      }

      SendEmail.sendRawMail("verify-email", emailData, [input.email],
        `Please confirm your email account`, "");

      const response: any = ResponseBuilder.respSuccess(userDetails, req.t("SIGNUP_SUCCESS"));
      res.status(response.status_code).json(response);
    } else {
      const response: any = ResponseBuilder.respSuccess(result.result, req.t("SIGNUP_SUCCESS"));
      res.status(response.status_code).json(response);
    }
  }


  public login = async (req: any, res: Response) => {
    const { email, password } = req.body;
    const result: any = await this.userUtils.getUserByEmail(email);
    if (result) {
      const userData = result;
      const verifyPassword = await Utils.compareEncryptedText(password, userData.password);
      if (verifyPassword) {
        const reqArr = [
          {
            $match: {
              'email': email.toLowerCase(),
            },
          },
          {
            $lookup: {
              from: 'roles',
              localField: 'userrole',
              foreignField: '_id',
              as: 'role'
            },

          },
          {
            $lookup: {
              from: 'roles',
              localField: 'userrole',
              foreignField: '_id',
              as: 'rolePermision'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'reporting_manager',
              foreignField: '_id',
              as: 'reportingManager'
            },

          },
          {
            $project:
            {
              'id': 1,
              'firstname': 1,
              'lastname': 1,
              'email': 1,
              'phone': 1,
              'emailconfirmed': 1,
              'userTypeCode': 1,
              'status': 1,
              'userrole': '$role.rolename',
              'reporting_manager': "$reportingManager",
              'user_permission': "$rolePermision"
            },
          },
        ];
        const finalresult: ResponseBuilder = await this.userUtils.getProfile(reqArr);
        const userDetails = finalresult[0];

        if (userDetails.emailconfirmed === true) {
          userDetails.token = Jwt.getAuthToken(userDetails);
        }
        const data = {
          'accessToken': 'Bearer ' + userDetails.token,
          'user': userDetails,
          'status': userDetails.status,
        };
        delete userDetails.token;
        const response: any = ResponseBuilder.respSuccess(data, req.t("LOGIN_SUCCESS"));

        res.status(response.status_code).json(response);
      } else {
        res.status(Constants.NOT_FOUND).json({ error: req.t("INVALID_CREDENTIAL") });
      }
    }
  }

  public userProfile = async (req: any, res: Response) => {
    const result: any = await this.userUtils.userProfile(req);
    if (result) {
      const response: any = ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
      res.status(response.status_code).json(response);
    } else {
      res.status(MessageModule.status.ok).json(result);
    }
  }

  public updateuserData = async (req: any, res: Response) => {
    const usersData: any = await this.userUtils.updateuserData(req);
    if (usersData) {
      const response = ResponseBuilder.respSuccess(usersData, req.t("SUCCESS"));
      res.status(usersData.code).json(response);
    } else {
      res.status(MessageModule.status.ok).json(usersData);
    }
  }

  public forgotPassword = async (req: any, res: Response) => {
    const input = req.body;
    const result: any = await this.userUtils.forgotPassword(req);
    if (result.length > 0) {
      const objData: any = result[0];
      delete objData.password;
      const reverseIdObj = { 'token': Utils.reverseString(objData._id.toString()) };
      const token = Jwt.getAuthToken(reverseIdObj);
      const url = process.env.ADMINURLSETPASSWORD + token;
      const userDetails: any = result[0];
      const emailData = {
        "reset_password": url,
      }

      SendEmail.sendRawMail("forgot-password", emailData, [input.email],
        `Reset Password`, "");
      const response: any = ResponseBuilder.respSuccess(userDetails, req.t("FORGOT_PASSWORD"));
      res.status(response.status_code).json(response);
    } else {
      const response: any = ResponseBuilder.respSuccess(result, req.t("FORGOT_PASSWORD"));
      res.status(response.status_code).json(response);
    }
  }

  public verify = async (req: any, res: Response) => {
    const error = {
      message: 'token Is Not Fount',
    };
    if (req.params.version || req.body.token) {
      const result: any = await this.userUtils.verify(req);
      if (result) {
        res.end("Email is been Successfully verified");
      } else {
        res.end("Email is not verified");
      }
    } else {
      res.status(Constants.INTERNAL_SERVER).json(error);
    }
  }

  public changepassword = async (req: any, res: Response) => {
    const result: ResponseBuilder = await this.userUtils.changepassword(req);
    if (result.result) {
      const response = ResponseBuilder.respSuccess(result.result, req.t("PASSWORD_UPDATED"));
      res.status(result.code).json(response);
    } else {
      res.status(MessageModule.status.ok).json(result);
    }
  }

  public resetPassword = async (req: any, res: Response) => {
    const result: any = await this.userUtils.resetPassword(req, res);
    if (result) {
      const response: any = ResponseBuilder.respSuccess(result, req.t("PASSWORD_RESETED"));
      res.status(response.status_code).json(response);
    } else {
      res.status(MessageModule.status.ok).json(result);
    }
  }
  /** 
   * @method getEmployees
   * @description : Get all employees.
   * @param req 
   * @param res 
   */
  public getEmployees = async (req: any, res: Response) => {
    // const email = req.body.email;
    const reqArr = [
      //  { 
      //    $match: {
      //     'email' : email
      //   }
      // },
      {
        $project:
        {
          'id': 1,
          'email': 1,
          'firstname': 1,
          'lastname': 1,

        },
      }
    ]
    const result: any = await this.userUtils.getProfile(reqArr);
    const response: any = ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
    res.status(response.status_code).json(response);
  }
  /** 
   * @method getEmployee
   * @description : Get all employee by id.
   * @param req 
   * @param res 
   */
  public getEmployee = async (req: any, res: Response) => {
    // const email = req.body.email;
    const arr = req.body.mentor_id;
    var result: any = [];
    for (let i = 0; i < arr.length; i++) {
      var details: any = await User.findOne({ _id: arr[i] }, { firstname: 1, lastname: 1 });
      result.push(details);
    }
    console.log(result);
    const response: any = ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
    res.status(response.status_code).json(response);
  }
  public getuser = async (req: any, res: Response) => {
    try {
      const result: any = await this.userUtils.userReportingRole(req);
      if (Object.is(result, null)) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
      }
      const response: any = ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
      res.status(response.status_code).json(response);
    } catch (e) {
      e.message = 'something went wrong';
      res.status(404).send({ e, error: e.message, status: 404 });
    }
  }

  public import = async (req: any, res: Response) => {
    request.post({
      url: process.env.ADAPIENDPOINT, headers: {
        'private-key': process.env.ADAPIKEY
      }
    }, async (err, response, body) => {
      if (err) {
        return res.status(500).json({ errors: "something went wrong" });
      }

      if (response.statusCode == 200) {

        const managerrole = await this.roleUtils.getRoleByName('manager');
        const employeerole = await this.roleUtils.getRoleByName('employee');

        var userdata = JSON.parse(body);
        let importtask = new Promise<void>((resolve, reject) => {
          userdata.forEach(async (element, index, array) => {
            const user = await this.userUtils.getUserByEmail(element.Email);
            let username = element.Name.split(" ");
            const userobj = {
              emailconfirmed: true,
              email: element.Email.toLowerCase(),
              password: await Utils.encryptText("test@123"),
              firstname: username[0],
              lastname: username[1],
              userrole: Types.ObjectId(employeerole._id),
              phone: element.PhoneNumber ? element.PhoneNumber.split(" ")[1] : "",
              userTypeCode: 1,
              status: element.Team == 'Resigned' ? 0 : 1,
              userband: element.Band
            }
            if (!user) {
              const result: any = await this.userUtils.createUser(userobj);
            } else {
              const result: any = await this.userUtils.updateuserDataById(user._id, userobj);
            }
            if (index === array.length - 1) resolve();
          });
        });

        importtask.then(() => {
          userdata.forEach(async element => {
            // console.log('email', element.Email);
            const user = await this.userUtils.getUserByEmail(element.Email);
            const reqArr = [
              {
                $addFields: {
                  "nameFilter": {
                    $concat: [
                      "$firstname",
                      " ",
                      "$lastname"
                    ]
                  }
                }
              },
              {
                $match: {
                  nameFilter: {
                    $regex: element.ReportingManagerName,
                    $options: "i"
                  }
                }
              }
            ];
            const finalresult: ResponseBuilder = await this.userUtils.getProfile(reqArr);
            const userDetails = finalresult[0];

            if (userDetails) {
              const userreportobj = {
                reporting_manager: Types.ObjectId(userDetails._id)
              }
              const userroleobj = {
                userrole: Types.ObjectId(managerrole._id)
              }
              const resultobj: any = await this.userUtils.updateuserDataById(user._id, userreportobj)
              const resultroleobj: any = await this.userUtils.updateuserDataById(userDetails._id, userroleobj)
            }

          });
        });
        return res.status(200).json({ succeess: 'imported successfully' });
      }
    })
  }

  public adfslogin = async (req, res) => {
    let xml = req.body.wresult;
    if (xml == undefined) {
      return res.status(404).json({ error: "page not found" });
    }
    xml2js.parseString(xml, { mergeAttrs: true }, async (err, result) => {
      if (err) {
        throw err;
      }

      const jsonString = JSON.stringify(result, null, 4);
      const json = JSON.parse(jsonString)
      var useremail = 'Sanjay.Santoki@devitpl.com';
      // useremail = json["t:RequestSecurityTokenResponse"]["t:RequestedSecurityToken"][0]['saml:Assertion'][0]["saml:AttributeStatement"][0]["saml:Attribute"][0]["saml:AttributeValue"][0]

      const user = await this.userUtils.getUserByEmail(useremail);
      if (user !== undefined) {
        /* let userobj = {
          _id: user._id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        } */
        let token = Jwt.getAuthToken(user.toJSON());
        res.cookie("token", token);
        // res.cookie("loginuser", JSON.stringify(userobj));  
      }
      res.redirect(process.env.FRONTHOST);
    });

  }

  public backendprogress = async (req, res) => {
    const day = new Date("2022-04-20").getDay();
    const current = new Date();     // get current date    
    current.setHours(0, 0, 0, 0);
    const weekstart = current.getDate() - current.getDay() - 6;
    const weekend = weekstart + 6;       // end day is the first day + 6 
    const monday = new Date(current.setDate(weekstart));
    const sunday = new Date(current.setDate(weekend));
    const startDate = new Date(monday.getTime() - (monday.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
    const endDate = new Date(sunday.getTime() - (sunday.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];

    const reqArr = [
      {
        $lookup: {
          from: 'emp_progresses',
          as: 'empusers',
          let: { "mainid": "$_id" },
          pipeline: [
            {
              $match: {
                // $expr: { /* $eq: ["$emp_id", "$$mainid"], */ "$gt": ["$start_week", new Date("2022-04-04")] },
                $expr: {
                  $and: [
                    { $eq: ["$emp_id", "$$mainid"] },
                    { "$eq": ["$start_week", new Date(startDate)] },
                    { "$eq": ["$end_week", new Date(endDate)] },
                    /* { "$lt": ["$end_week", new Date("2022-04-04")] } */
                  ]
                }
              }
            }
          ],
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'reporting_manager',
          foreignField: '_id',
          as: 'reporting_manager',
        },
      },
      {
        $match: { 'empusers': [] }
      },
      //to get group of email which help to send single mail to all
      /* {
        $group:
        {
          _id: "$reporting_manager.email",
          emails: { $push: { $concat: ["$email"] } }
        }
      }, */
      /* {
        $limit:3
      } */
    ];
    const result: any = await this.userUtils.getProfile(reqArr);
    /* if (result.length > 0) {
      result.forEach(async element => {
        try {
          console.log(element.reporting_manager[0].email);
          const emailData = {
            "firstname": element.firstname
          }
          // const toEmail = [element.email];
          const toEmail = ['Rajdeep.vaghela@devitpl.com'];
          let ccEmail = [];

          if (day == 2 || day == 3) {
            // ccEmail = [element.reporting_manager[0].email];
            ccEmail = ['shubham.sarvariya@devitpl.com'];
          }
          SendEmail.sendRawMail("training-reminder", emailData, toEmail,
            `Preggress Update Reminder`, "", false, ccEmail);
        } catch (e) {
          console.log(e);
        }
      });
    } */

    return res.status(200).json({ succeess: 'today is monday', result });
  }

  public sendtopm = async (req, res) => {
    const allPM: any = await this.userUtils.getAllPM();
    let respArr = [];
    if (allPM.length > 0) {
      for await (const element of allPM) {
        respArr = await this.userUtils.getAllReporting(element._id);
        if (respArr.length > 0) {
          /* const emailData = {
            "{firstname}": element.firstname,
            "{employees}": respArr.toString()
          };
          // const toEmail = [element.email];
          const toEmail = ['Rajdeep.vaghela@devitpl.com'];
          try{
          SendEmail.sendRawMail("send-to-pm", emailData, toEmail,
            `Employee Preggress Reminder`, "", false);
          } catch (e) {
            console.log(e);
          } */
          return res.status(200).json({ succeess: 'list send to pm', respArr });
        }
      }
    }
    return res.status(200).json({ succeess: 'No PM found' });
  }

  public trainingprogress = async (req, res) => {
    const allPM: any = await this.userUtils.getAllPM();
    let respArr = [];
    if (allPM.length > 0) {
      for await (const element of allPM) {
        respArr = await this.userUtils.getAllEmployeeProgress(element._id);
        if (respArr.length > 0) {
          /* const emailData = {
            "{firstname}": element.firstname,
            "{usertable}": respArr.join('')
          };
          // const toEmail = [element.email];
          const toEmail = ['Rajdeep.vaghela@devitpl.com'];
          try{
            SendEmail.sendRawMail("send-progress-list", emailData, toEmail,
            `Employee Preggress`, "", false);
          } catch (e) {
            console.log(e);
          } */
          return res.status(200).json({ succeess: 'preogress send', respArr });
        }
      }
    }
    return res.status(200).json({ succeess: 'No PM found' });
  }


  public assignRole = async (req: any, res: Response) => {
    const updateRole: any = await this.userUtils.assignRoles(req.body);
    const response = ResponseBuilder.respSuccess(updateRole, req.t("SUCCESS"));
    return res.status(MessageModule.status.ok).json(response);
  }
  public fetchRolesAndPermissions = async (req: any, res: Response) => {
    console.log("success", req.body);
    const userRolesAndRights: any = await this.userUtils.fetchRights({ id: req.body.employee_id })
    console.log("userRolesAndRights", userRolesAndRights)
    const response = ResponseBuilder.respSuccess(userRolesAndRights, req.t("SUCCESS"));
    return res.status(MessageModule.status.ok).json(response);
  }
}