import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import {
  IsMediaSizeValidConstraint,
} from "./roleValidator";
import { Model } from "../../../model";

export class RoleModel extends Model {



  @IsNotEmpty()
  public rolename: string;
  @IsNotEmpty()
  public rights: string;
  @IsOptional()
  public isactive: string;

  @IsOptional()
  public status: number;

  constructor(body: any) {
    super();
    const {
      rolename,
      isactive,
      rights,
      status,
    } = body;
    this.rolename = rolename;
    this.isactive = isactive;
    this.rights = rights;
    this.status = status;

  }

}

export class UserUpdateModel extends Model {

  @IsNotEmpty()
  public firstname: string;

  @IsNotEmpty()
  public lastname: string;

  @IsEmail({}, { message: "EMAIL_INVALID" })
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public phone: string;

  constructor(body: any) {
    super();
    const {
      firstname,
      lastname,
      email,
      phone
    } = body;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.phone = phone;
  }
}


