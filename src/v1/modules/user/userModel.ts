import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import {
  IsMediaSizeValidConstraint,
} from "./userValidator";
import { Model } from "../../../model";

export class UserModel extends Model {

  @IsNotEmpty()
  public firstname: string;

  @IsNotEmpty()
  public lastname: string;

  @IsEmail({}, { message: "EMAIL_INVALID" })
  @IsNotEmpty()
  public email: string;

  @IsOptional()
  public mobileNo: string;

  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public userTypeCode: number;

  @IsOptional()
  public status: number;

  constructor(body: any) {
    super();
    const {
      firstname,
      lastname,
      email,
      password,
      userTypeCode,      
      mobileNo  
    } = body;
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.userTypeCode = userTypeCode;    
    this.mobileNo = mobileNo;  
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

export class ForgotPasswordModel extends Model {

  @IsNotEmpty()
  public email: string;


  constructor(body: any) {
    super();
    const {
      email,
    } = body;

    this.email = email;
  }
}

export class LoginModel extends Model {
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  public password: string;

  constructor(body: any) {
    super();
    const {
      email,
      password,
      deviceId,
      deviceToken
    } = body;

    this.email = email;
    this.password = password;
  }
}

export class ResetPasswordModel extends Model {
  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public confirmPassword: string;

  constructor(body: any) {
    super();
    const {
      password,
      confirmPassword,
    } = body;

    this.password = password;
    this.confirmPassword = confirmPassword;
  }
}

export class ChangePasswordModel extends Model {
  @IsNotEmpty()
  public Password: string;

  @IsNotEmpty()
  public confirmPassword: string;
  @IsNotEmpty()
  public oldPassword: string;

  constructor(body: any) {
    super();
    const {
      oldPassword,
      Password,
      confirmPassword
    } = body;
    this.Password = Password;
    this.confirmPassword = confirmPassword;
    this.oldPassword = oldPassword;
    
  }
}

export class VerifyOtpModel extends Model {
  @IsNotEmpty()
  public otp: string;

  constructor(body: any) {
    super();
    const {
      otp
    } = body;

    this.otp = otp
  }
}

