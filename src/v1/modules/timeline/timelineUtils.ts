import * as _ from "lodash";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Types } from "mongoose";
import { Utils } from "../../../helpers/utils";
import { Timeline } from "./timelineSchema";
import { Jwt } from "../../../helpers/jwt";
export class TimelineUtils {
  request: any;

  // Create User
  public timeLine = async (Data: Json) => {
    const timeline = new Timeline(Data);
    return await timeline.save();
  }
  public async getById(req: any) {
    const reqArr = [
      {
        $match: {
          'emp_id': Types.ObjectId(req.params.id),
        },
      },
      {
          $project: {
            createdAt: 1,
            action : 1
          }
      },
      {$sort : {createdAt: -1}},
        // {$limit : 8},
    ]
    return await Timeline.aggregate(reqArr).exec();
  }

}