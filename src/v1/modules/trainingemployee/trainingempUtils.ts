import * as _ from "lodash";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Types } from "mongoose";
// import { Training } from "../training/trainingSchema";
import { TrainingEmp } from "./trainingempSchema";
import { Utils } from "../../../helpers/utils";
import { Jwt } from "../../../helpers/jwt";
export class TrainingEmpUtils {
  request: any;

  // Create User
  public async create(userDetail: Json) {
    const training = new TrainingEmp(userDetail);
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
    return await TrainingEmp.aggregate(reqArr).exec();
  }
  public async updateTrainingData(req: any) {
    if (typeof req.body.data === 'object') {
      req.body = req.body.data;
    } else {
      req.body = JSON.parse(req.body.data);
    }
    req.body.updated_date = new Date();
   
    return await TrainingEmp.findByIdAndUpdate(req.params.id, req.body, { new: true })
  }
  public async getAll(req: any) {
    return await TrainingEmp.find();
  }
}