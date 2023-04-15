 import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import {
  IsMediaSizeValidConstraint,
} from "./platformValidator";
import { Model } from "../../../model";

export class PlatformModel extends Model {
  platform: any;

}

export class PlatformUpdateModel extends Model {

  public platform: string;


}

