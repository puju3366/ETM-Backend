import { Response } from "express";
import * as _ from "lodash";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { RoleUtils } from "./roleUtils";
import { Role } from "./roleSchema";
import { MessageModule } from "../../../helpers/commonMessage";

export class RoleController {

  private roleUtils: RoleUtils = new RoleUtils();

  /** 
   * @method Create
   * @description : Create Role.
   * @param req 
   * @param res 
   */
  public create = async (req: any, res: Response) => {
    const mydata = req.body;
    const roleData: any = await this.roleUtils.createRole(mydata);
    const response = ResponseBuilder.respSuccess(roleData, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  };

  /** 
   * @method getAll
   * @description : Get all the role details for listing.
   * @param req 
   * @param res 
   */
  public getAll = async (req: any, res: Response) => {
    const roleData: any = await this.roleUtils.getAllRoles(req);
    const response = ResponseBuilder.respSuccess(roleData, req.t("SUCCESS"));
    res.status(MessageModule.status.ok).json(response);
  }

  /**
  * @method getRoleById
  * @description : Get role details by Role id.
  * @param req 
  * @param res 
  */
  public getRoleById = async (req: any, res: Response) => {
    try {
      const result: any = await this.roleUtils.getById(req)
      if (Object.entries(result).length === 0) {
        const response: any = ResponseBuilder.notFound(MessageModule.message.notFound);
        res.status(MessageModule.status.not_found).json(response);
      } else {
        const response: any = ResponseBuilder.respSuccess(result, req.t("SUCCESS"));
        res.status(response.status_code).json(response);
      }
    } catch (e) {
      e.message = 'not found';
      res.status(404).send({ e, error: e.message, status: 404 });
    }
  };

  /** 
   * @method delete
   * @description : delete role.
   * @param req 
   * @param res 
   */
  public delete = async (req: any, res: Response) => {
    const id = req.params.id;
    const data = await Role.updateOne({ _id: id }, { status: 2 })
    const resp = {
      success: 'Role deleted sucessfully'
    }
    const response = ResponseBuilder.respSuccess(resp, req.t("SUCCESS"));
    if (response) {
      res.status(MessageModule.status.ok).json(response);
    }
  }

  /** 
    * @method update
    * @description : update role.
    * @param req 
    * @param res 
    */
  public update = async (req: any, res: Response) => {
    const rolesData: any = await this.roleUtils.updateRoleData(req);
    const response = ResponseBuilder.respSuccess(rolesData, req.t("SUCCESS"));
    if (response) {
      res.status(MessageModule.status.ok).json(response);
    }
  }
}