import * as _ from "lodash";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Types } from "mongoose";
import { Dashboard } from "../dashboard/dashboardSchema";
import { Training } from "../training/trainingSchema";
import { Progress } from "./progressSchema";
import { TrainingEmp } from "../trainingemployee/trainingempSchema";
import { Utils } from "../../../helpers/utils";
import { Jwt } from "../../../helpers/jwt";
export class ProgressUtils {
  /**
   * Employee : Add  Training data
   * @param : any
   * @returns  nothing for the data
   */
  public async create(userDetail: Json) {
    const progress = new Progress(userDetail);
    return await progress.save();
  }

  /**
   * Employee : Update Traning For employee
   * @param : any

   * @returns 
   */
  public async update(req: any) {
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
    return await Dashboard.findByIdAndUpdate(id, req.body, { new: true })
  }

  // Get event details by id
  public async getTraningName(req: any) {
    //console.log(req);
    // return await Dashboard.findOne({_id: req.params.id})

    const reqArr = [
      {
        $match: {
          'emp_id': Types.ObjectId(req.params.id)
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
      // {
      //   $lookup: {
      //     from: 'users',
      //     localField: 'emp_id',
      //     foreignField: '_id',
      //     as: 'user'

      // },

      //   $match: {
      //     'user._id': Types.ObjectId(req.params.id),
      //  },
      // },
      {
        $lookup: {
          from: 'users',
          localField: 'training.mentor',
          foreignField: '_id',
          as: 'mentors'

        },
      },

    ];
    req.reqArr = reqArr;
    return await TrainingEmp.aggregate(req.reqArr).exec();
  }

  // Get event details by id

  public async getTraningNameById(req: any) {

    const reqArr = [
      {
        $match: {
          'training_id': Types.ObjectId(req.params.id)
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
        $lookup: {
          from: 'emp_progresses',
          localField: 'training_id',
          foreignField: 'training_id',
          as: 'completed'
        },
      },

      {
        $lookup: {
          from: 'users',
          localField: 'training.mentor',
          foreignField: '_id',
          as: 'mentors'
        },
      },
      { $sort: { "completed.createdAt": -1 } },
      {

        $project: {
          training: "$training",
          completed_videos: { $sum: "$completed.completed_videos" },
          startweek: "$completed.start_week",
          endweek: "$completed.end_week",
          completed_videos_per: { $multiply: [{ $divide: ["$completed.completed_videos", "$sum"] }, 100] },
          mentor: "$mentors"
        }
      }
    ];
    req.reqArr = reqArr;
    return await TrainingEmp.aggregate(req.reqArr).exec();
  }
}