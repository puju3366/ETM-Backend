import * as _ from "lodash";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Types } from "mongoose";
import { Training } from "../training/trainingSchema";
import { Utils } from "../../../helpers/utils";
import { Jwt } from "../../../helpers/jwt";
export class TrainingUtils {
  request: any;

  // Create User
  public async create(userDetail: Json) {
    const training = new Training(userDetail);
    return await training.save();
  }

  public async getById(req: any) {
    const reqArr = [
      {
        $match: {
          '_id': Types.ObjectId(req.params.id),
        },
      },
    ]
    return await Training.aggregate(reqArr).exec();
  }
  public async updateTrainingData(req: any) {
    if (typeof req.body.data === 'object') {
      req.body = req.body.data;
    } else {
      req.body = JSON.parse(req.body.data);
    }
    req.body.updated_date = new Date();
   
    return await Training.findByIdAndUpdate(req.params.id, req.body, { new: true })
  }
  public async getAllTrainings(req: any) {
    var filter = {status:1,focus_area:null,trainingname:null,platform:null,level:null};

    return await Training.find().sort({'createdAt': -1});
  }
  public async getTraningDetails(req: any) {
   const reqArr = [
    {
      $match: {
        '_id': Types.ObjectId(req.params.id),
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'mentor',
        foreignField: '_id',
        as: 'mentor'
    },
  }
    
  ];
  return await Training.aggregate(reqArr).exec();
  }
}