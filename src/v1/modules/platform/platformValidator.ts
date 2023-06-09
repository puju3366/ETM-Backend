 import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import * as My from "jm-ez-mysql";
import { Constants } from "../../../config/constants";
import { Tables } from "../../../config/tables";

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {

  public async validate(email: string, args: ValidationArguments) {
    const user = await My.first(Tables.USERS, ["id"], "email = ?", [email]);
    if (user) {
      return false;
    } else {
      return true;
    }
  }
}

export class IsMobileAlreadyExistConstraint implements ValidatorConstraintInterface {

  public async validate(mobile: string, args: ValidationArguments) {
    const user = await My.first(Tables.USERS, ["id"], "mobile = ?", [mobile]);
    if (user) {
      return false;
    } else {
      return true;
    }
  }
}
//validatior classes added by the sync code
@ValidatorConstraint({ async: false })
export class IsMediaSizeValidConstraint implements ValidatorConstraintInterface {
  public validate(file: any, args: ValidationArguments) {
    return file.size < Constants.UPLOAD_SIZES.PROFILE_PICTURE;
  }
}