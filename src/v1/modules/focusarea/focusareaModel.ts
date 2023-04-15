 import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import {
  IsMediaSizeValidConstraint,
} from "./focusareaValidator";
import { Model } from "../../../model";

export class FocusareaModel extends Model {
  focus_area: any;

}

export class FocusareaUpdateModel extends Model {

  public focus_area: string;


}

