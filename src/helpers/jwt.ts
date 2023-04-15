import * as jwt from "jsonwebtoken";
import { UserUtils } from "../v1/modules/user/userUtils";
const tokens = [];
const userUtils: UserUtils = new UserUtils();

export class Jwt {
  /*
  * getAuthToken
  */
   public static getAuthToken(data:any) {
    return jwt.sign(data, process.env.JWT_SECRET);
  }

  /*
  * decodeAuthToken
  */

  public static decodeAuthToken(token: string) {
    if (token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
    return false;
  }

}
