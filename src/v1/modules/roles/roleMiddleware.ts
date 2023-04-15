import { Response } from "express";
import { Role } from "../roles/roleSchema"
import { Constants } from "../../../config/constants";
export class RoleMiddleware {
  public checkNameExists = async (req: any, res: Response, next: () => void) => {
    let role = [];
    if (req.body.rolename) {
      role = await Role.find({ rolename: req.body.rolename });
    }
    if (role.length > 0) {
      const resArr = {
        "items": [],
        "status": 0,
        "status_code": 200,
        "message": {
          "rolename": req.t("ERR_ROLE_ALREADY_EXISTS")
        }
      }
      res.status(Constants.NOT_FOUND).json(resArr);
    } else {
      next();
    }
  }

  public checkNameExistsedit = async (req: any, res: Response, next: () => void) => {
    let role = [];
    if (req.body.rolename && req.params.id) {
      role = await Role.find({ $and: [{ $or: [{ rolename: req.body.rolename }] }, { _id: { $ne: req.params.id } }] });
    }
    if (role.length > 0) {
      const resArr = {
        "items": [],
        "status": 0,
        "status_code": 200,
        "message": {
          "rolename": req.t("ERR_ROLE_ALREADY_EXISTS")
        }
      }
      res.status(Constants.NOT_FOUND).json(resArr);
    } else {
      next();
    }
  }

}