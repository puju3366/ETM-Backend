import * as l10n from "jm-ez-l10n";
import * as My from "jm-ez-mysql";
import * as _ from "lodash";
import { Jwt } from "./helpers/jwt";
import { Tables } from "./config/tables";
import { Request, Response } from "express";
import { User } from "./helpers/user";
import { Constants } from "./config/constants";

export class Middleware {

  private user: User = new User();

  public getUserAuthorized = async (req: any, res: Response, next: () => void) => {
    const authorization = req.headers.authorization;
    if (authorization && !_.isEmpty(authorization)) {
      try {
        const tokenInfo = Jwt.decodeAuthToken(authorization.toString());

        if (tokenInfo) {
          // query
          const user = await My.first(Tables.USERS, ["id", "firstName", "lastName", "email", "mobile", "roleId", "isLogin", "deviceId", "isBlock"],
            "id = ?", [tokenInfo.userId]);
          if (user) {
            if (user.isBlock) {
              return res.status(401).json({ error: req.t("INACTIVE_USER") });
            }
            else if (user.isLogin === 1) {
              if (user.deviceId === tokenInfo.deviceId) {
                req._user = user;
                next();
              }
              else {
                res.status(401).json({ error: l10n.t("ERR_UNAUTH") });
                return;
              }

            } else {
              res.status(412).json({ error: l10n.t("USER_NOT_VERIFIED") });
              return;
            }
          } else {
            res.status(401).json({ error: l10n.t("ERR_UNAUTH") });
            return;
          }
        } else {
          res.status(401).json({ error: l10n.t("ERR_UNAUTH") });
          return;
        }
      } catch (error) {
        res.status(500).json({ error: l10n.t("ERR_INTERNAL_SERVER") });
        return;
      }
    } else {
      if (req.path.includes('guest')) {
        next();
      } else {
        res.status(401).json({ error: l10n.t("ERR_UNAUTH") });
        return;
      }
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
  public checkrecordexists = async (req: any, res: Response, next: () => void) => {
    const { id } = req.params;
    if ((id && id.hasOwnProperty('_id') || id.hasOwnProperty('id')) ?
      (id.hasOwnProperty('_id') ? id._id : id.id) : (req.body._id || req.body.id)) {
      next();
    } else {
      return res.status(Constants.NOT_FOUND).json({ error: req.t("USER_NOT_EXISTS") });
    }
  }
}
