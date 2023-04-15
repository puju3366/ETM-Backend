import * as _ from "lodash";
import { Types } from "mongoose";
import { Role } from "../roles/roleSchema";



export class RoleUtils {
  request: any;

  // Create User
  public async createRole(userDetail: Json) {
    const role = new Role(userDetail);
    return await role.save();
  }

  public async getAllRoles(req: any) {
    return await Role.find({ status: { $in: [1, 0] } }).sort({ 'createdAt': -1 });
  }

  // get role by name
  public async getRoleByName(rolename: string) {
    return await Role.findOne({ rolename });
  }

  public async getById(req: any) {
    const reqArr = [
      {
        $match: {
          '_id': Types.ObjectId(req.params.id),
        },
      },
    ]
    return await Role.aggregate(reqArr).exec();
  }

  public async updateRoleData(req: any) {
    req.body.updated_date = new Date();
    return await Role.findByIdAndUpdate(req.params.id, req.body, { new: true })
  }
}