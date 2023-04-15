import * as _ from "lodash";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Types } from "mongoose";
import { User } from "../user/userSchema";
import { Utils } from "../../../helpers/utils";
import { Jwt } from "../../../helpers/jwt";
export class UserUtils {
  request: any;

  // Create User
  public async createUser(userDetail: any) {
    const user = new User(userDetail);
    return await user.save();
  }
  public async questionnairemappingUtils(req: any): Promise<ResponseBuilder> {
    const questionnairemapping = await User.aggregate(req.reqArr).exec();
    return ResponseBuilder.data(questionnairemapping[0]);
  }
  public async updateuserData(req: any) {
    if (typeof req.body.data === 'object') {
      req.body = req.body.data;
    } else {
      req.body = JSON.parse(req.body.data);
    }
    req.body.updated_date = new Date();
    // req.body.updated_by = req.payload._id;
    const id = (req.params &&
      req.params.hasOwnProperty('_id') ||
      req.params.hasOwnProperty('id')) ?
      (req.params.hasOwnProperty('_id') ?
        req.params._id : req.params.id) :
      (req.body._id || req.body.id);
    req.params.id = id;
    return await User.findByIdAndUpdate(id, req.body, { new: true })
  }
  public async userProfile(req: any): Promise<ResponseBuilder> {
    const reqArr = [
      {
        $match: {
          // eslint-disable-next-line new-cap
          '_id': Types.ObjectId(req.params.id),
        },
      },
      {
        $lookup: {
          from: 'usergroups',
          localField: 'userTypeCode',
          foreignField: 'typecode',
          as: 'usergroup',
        },
      },
    ];
    req.reqArr = reqArr;
    return await User.aggregate(req.reqArr).exec();
  }

  public async getUserByEmail(email: string) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  public async getProfile(whereObj: any[]): Promise<ResponseBuilder> {
    return await User.aggregate(whereObj).exec();
  }

  public async changepassword(req: any): Promise<ResponseBuilder> {
    if (req.body.oldPassword && req.body.Password && req.payload._id) {
      req.params = {
        id: req.payload._id,
      };
      const users: any = await User.findOne({
        _id: req.params.id,
        status: {
          $in: [0, 1]
        },
      });
      const isMatch = await Utils.compareEncryptedText(
        req.body.oldPassword,
        users.password
      );
      if (isMatch) {
        const hash = await Utils.encryptText(req.body.Password);
        req.body.password = hash;
        req.params = {
          _id: req.payload._id,
        };
        req.body.updated_date = new Date();
        const id = (req.params && req.params.hasOwnProperty('_id') ||
          req.params.hasOwnProperty('id')) ? (req.params.hasOwnProperty('_id') ?
            req.params._id : req.params.id) : (req.body._id || req.body.id);
        req.params.id = id;
        const userData: any = await User.findByIdAndUpdate(id, req.body, { new: true });
        return ResponseBuilder.data(userData);
      } else {
        const message = req.t("OLD_PASSWORD_WRONG");
        return ResponseBuilder.data('', message);
      }
    }
    return ResponseBuilder.data({});
  }
  // verify the user after sign up
  public async verify(req) {
    const tokenData = await Jwt.decodeAuthToken(req.body.token);
    req.reqArr = { _id: await Utils.reverseString(tokenData.token) };
    req.body = { emailconfirmed: true, status: 1 };
    return await User.findOneAndUpdate(req.reqArr,
      req.body, {
      new: true,
      runValidators: true
    })
  }
  public async resetPassword(req, res: any): Promise<ResponseBuilder> {
    if (req.body.password && req.body.confirmPassword && req.body.token) {
      const hash = await Utils.encryptText(req.body.password);
      req.body.password = hash;
      const tokenData = await Jwt.decodeAuthToken(req.body.token);
      req.body.id = await Utils.reverseString(tokenData.token);
      req.body.updated_date = new Date();
      const id = req.body.id;
      const data: any = await User.findByIdAndUpdate(id, req.body, { new: true })
      return data;
    }
  }
  public async forgotPassword(req): Promise<ResponseBuilder> {
    const reqArr = [
      {
        $match: {
          'email': req.body.email,
        },
      },
      {
        $lookup: {
          from: 'usergroups',
          localField: 'userTypeCode',
          foreignField: 'typecode',
          as: 'usergroup',
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
          'usergroup': 1,
        },
      },
    ];
    req.reqArr = reqArr;
    return await User.aggregate(req.reqArr).exec();
  }
  public async userReportingRole(req: any): Promise<ResponseBuilder> {
    const reqArr = [
      {
        $match: {
          // eslint-disable-next-line new-cap
          '_id': Types.ObjectId(req.params.id),
        },
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
        $lookup: {
          from: 'roles',
          localField: 'userrole',
          foreignField: '_id',
          as: 'roles',
        },
      },
      {
        $project: {
          lastname: 1,
          email: 1,
          firstname: 1,
          phone: 1,
          reporting_manager: '$reporting_manager',
          roles: '$roles.rolename',
          rolesId: '$roles._id'
        },
      },
    ];
    req.reqArr = reqArr;
    return await User.aggregate(req.reqArr).exec();
  }

  public async updateuserDataById(id: any, userdata: any) {
    userdata.updated_date = new Date();
    // req.body.updated_by = req.payload._id;
    return await User.findByIdAndUpdate(id, userdata, { new: true })
  }

  public getdateforweek() {
    const current = new Date();     // get current date    
    current.setHours(0, 0, 0, 0);
    const weekstart = current.getDate() - current.getDay() - 6;
    const weekend = weekstart + 6;       // end day is the first day + 6 
    const monday = new Date(current.setDate(weekstart));
    const sunday = new Date(current.setDate(weekend));
    const startDate = new Date(monday.getTime() - (monday.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
    const endDate = new Date(sunday.getTime() - (sunday.getTimezoneOffset() * 60 * 1000)).toISOString().split('T')[0];
    return { startDate, endDate };
  }

  public async getAllReporting(reportingid: any, userdata: any = []) {
    const { startDate, endDate } = this.getdateforweek();
    const reqArr = [
      {
        $lookup: {
          from: 'emp_progresses',
          as: 'empusers',
          let: { "mainid": "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$emp_id", "$$mainid"] },
                    { "$eq": ["$start_week", new Date(startDate)] },
                    { "$eq": ["$end_week", new Date(endDate)] },
                  ]
                }
              }
            },
          ],
        }
      },
      {
        $match: { /* 'empusers': [], */ 'reporting_manager': Types.ObjectId(reportingid), 'status': 1 }
      },
      /* {
        $limit: 1
      } */
    ];
    const result: any = await this.getProfile(reqArr);
    if (result.length > 0) {
      for await (const element of result) {
        if (element.empusers.length === 0) userdata.push(element.email);
        await this.getAllReporting(element._id, userdata);
      }
    }
    // console.log('userdata', userdata);
    return userdata;
  }

  public async getAllPM() {
    //get all pm having band A
    const getPMArr = [{
      $match: {
        userband: 'A',
        status: 1,
        email: 'shomy.sathyadevan@devitpl.com'
      }
    }];
    return await this.getProfile(getPMArr);
  }

  public async getAllEmployeeProgress(reportingid: any, userdata: any = []) {
    const reqArr = [
      {
        $match: {
          'reporting_manager': Types.ObjectId(reportingid), 'status': 1
        }
      },
      {
        $lookup: {
          from: 'emp_progresses',
          localField: '_id',
          foreignField: 'emp_id',
          as: 'emp_progress'
        },
      },
      {
        $lookup: {
          from: 'trainings',
          localField: 'emp_progress.training_id',
          foreignField: '_id',
          as: 'training'
        },
      },
      {
        $project: {
          user: "$$ROOT",
          completed_videos: { $sum: "$emp_progress.completed_videos" }
        }
      }
    ];
    const result: any = await this.getProfile(reqArr);
    if (result.length > 0) {
      for await (const element of result) {
        userdata.push("<tr><td>" + element.user.email + "</td><td>" + element.user.firstname + "</td><td>" + element.completed_videos + "</td></tr>");
        await this.getAllEmployeeProgress(element.user._id, userdata);
      }
    }
    return userdata;
  }

  public async assignRoles(req: any) {
    return await User.findOneAndUpdate({ _id: req.employee_id, }, { $set: { userrole: req.role } }, { new: true })
  }
  public async fetchRights(req: any) {
    console.log("req", req.id)
    const reqArr = [
      {
        $match: {
          '_id': Types.ObjectId(req.id)
        }
      }, // here all wokrs good
      {
        $lookup: {
          from: 'roles',
          localField: 'userrole',
          foreignField: '_id',
          as: 'rolePermision'
        }
      }
      
    ];
    req.reqArr = reqArr;
    return User.aggregate(req.reqArr).exec()
  }
}