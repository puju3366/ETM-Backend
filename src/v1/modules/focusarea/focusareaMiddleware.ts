 import { Response } from "express";
import * as My from "jm-ez-mysql";
import { Tables } from "../../../config/tables";
import { Utils } from "../../../helpers/utils";
import { User } from "../user/userSchema"
import { Constants } from "../../../config/constants";
import { Jwt } from "../../../helpers/jwt";

export class FocusareaMiddleware {
  public checkMobileNumberExists = async (req: any, res: Response, next: () => void) => {
    let user = [];
    if (req.body.phone) {
        user = await User.find({ phone: req.body.phone });
    }
    if (user.length > 0) {
      const resArr = {
        "items": [],
        "status": 0,
        "status_code": 200,
        "message": {
          "phone": req.t("ERR_MOBILE_ALREADY_EXISTS")
        }
      }
      res.status(Constants.NOT_FOUND).json(resArr);
    } else {
      next();
    }
  }

  public checkEmailExists = async (req: any, res: Response, next: () => void) => {
    let user = [];
    if (req.body.email) {
      user = await User.find({ email: req.body.email });
    }
    if (user.length > 0) {
    const resArr = {
        "items": [],
        "status": 0,
        "status_code": 200,
        "message": {
        "email": req.t("ERR_EMAIL_ALREADY_EXISTS")
      }
    }
    res.status(Constants.NOT_FOUND).json(resArr);
    } else {
      next();
    }
  }

  public IsUserExists = async (req: any, res: Response, next: () => void) => {
    const customer:any = await User.find({ email: req.body.email }).exec();
    if (customer && customer.length > 0) {
      if (!customer[0].emailconfirmed) {
        res.status(Constants.NOT_FOUND).json({ error: req.t("CONFIRM_EMAIL")});
      } else {
        next();
      }
    } else {
      res.status(Constants.NOT_FOUND).json({ error: req.t("USER_NOT_EXISTS")});
    }
  }
  public verifyOldPassword = async (req: any, res: Response, next: () => void) => {
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(Constants.NOT_FOUND).json({ error: req.t('CONFIRM_PASSWORD_NOT_MATCH') });
    } else {
      const result = await My.first(Tables.USERS, ["password"], "id = ?", [req._user.id]);
      const comparePassword = await Utils.compareEncryptedText(req.body.oldPassword, result.password);
      if (comparePassword) {
        next();
      } else {
        return res.status(Constants.NOT_FOUND).json({ error: req.t('OLD_PASSWORD_WRONG') });
      }
    }
  }


  // Below middleware is for checking if mobile no is registered or not

  public isMobileRegistered = async (req: any, res: Response, next: () => void) => {

    const user = await My.first(Tables.USERS, ["*"], `mobile = ?`, [req.body.mobile]);
    if (user && user.isBlock === 0) {
      next();
    } else if (user.isBlock === 1) {
      res.status(Constants.NOT_FOUND).json({ error: req.t("INACTIVE_USER")});
    }
    else {
      res.status(Constants.NOT_FOUND).json({ error: req.t("MOBILE_NOT_REGISTERED")});
    }
  }


  public isEmailRegistered = async (req: any, res: Response, next: () => void) => {

    const user = await My.first(Tables.USERS, ["*"], `email = ?`, [req.body.email]);
    if (user && user.status === 1) {
      next();
    } else if (user.status === 0) {
      res.status(Constants.NOT_FOUND).json({ error: req.t("INACTIVE_USER")});
    }
    else {
      res.status(Constants.NOT_FOUND).json({ error: req.t("EMAIL_NOT_REGISTERED")});
    }
  }
  public checktoken = async (req: any, res: Response, next: () => void) => {
    const {
      headers: { authorization },
    } = req;
    if (authorization && (authorization.split(' ')[0] === 'JWT'
      || authorization.split(' ')[0] === 'Bearer')) {
      const token = Jwt.decodeAuthToken(authorization.split(' ')[1]);
      req.payload = token;
      next();
    } else if (req.session && req.session.token) {
      const token = Jwt.decodeAuthToken(req.session.token);
      req.payload = token;
      next();
    } else {
      return res.status(401).json({ error: req.t("TOKEN_NOT_FOUND") });
    }
  }
}