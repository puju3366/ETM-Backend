import { Response } from "express";
import * as _ from "lodash";
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";
import { ResponseBuilder } from "../../../helpers/responseBuilder";
import { Utils } from "../../../helpers/utils";
import { SendEmail } from "../../../helpers/sendEmail";
import bcrypt = require('bcryptjs');
import { MessageModule } from "../../../helpers/commonMessage";
import { RightsUtils } from "./rightsUtils";
const { Rights } = require('./rightsSchema')
const { Modules } = require('./rightsSchema')


export class RightsController {

    private RightsUtils: RightsUtils = new RightsUtils();

    public getAll = async (req: any, res: Response) => {
        const mydata = req.body;
        const RightsCreate: any = await this.RightsUtils.getRights(mydata);
        const response = ResponseBuilder.respSuccess(RightsCreate, req.t("SUCCESS"));
        res.status(MessageModule.status.ok).json(response);
    };
    public create = async (req: any, res: Response) => {
        const mydata = req.body;
        const moduleName: any = await this.RightsUtils.getModuleById(req);
        const slug = moduleName[0].slug + "/" + mydata.name.toLowerCase();
        mydata.slug = slug
        const roleData: any = await this.RightsUtils.createRight(mydata);
        const response = ResponseBuilder.respSuccess(roleData, req.t("SUCCESS"));
        res.status(MessageModule.status.ok).json(response);
    };
    /** 
    * @method delete
    * @description : delete role.
    * @param req 
    * @param res 
    */
    public delete = async (req: any, res: Response) => {
        const id = req.params.id;
        const data = await Rights.updateOne({ _id: id }, { status: 2 })
        const resp = {
            success: 'Rights deleted sucessfully'
        }
        const response = ResponseBuilder.respSuccess(resp, req.t("SUCCESS"));
        if (response) {
            res.status(MessageModule.status.ok).json(response);
        }
    }

    public update = async (req: any, res: Response) => {
        const moduleName: any = await this.RightsUtils.getModuleById(req);
        req.body.slug = moduleName[0].slug + "/" + req.body.name.toLowerCase();
        const rolesData: any = await this.RightsUtils.updateRightData(req);
        const response = ResponseBuilder.respSuccess(rolesData, req.t("SUCCESS"));
        if (response) {
            res.status(MessageModule.status.ok).json(response);
        }
    }
    public getAllModule = async (req: any, res: Response) => {
        const modulesData: any = await this.RightsUtils.getModule(req);
        const response = ResponseBuilder.respSuccess(modulesData, req.t("SUCCESS"));
        res.status(MessageModule.status.ok).json(response);
    }

    public getRightById = async (req: any, res: Response) => {
        try {
            const result: any = await this.RightsUtils.getById(req)
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
}