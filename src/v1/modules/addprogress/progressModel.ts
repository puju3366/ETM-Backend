 import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import {
  IsMediaSizeValidConstraint,
} from "./progressValidator";
import { Model } from "../../../model";

export class ProgressModel extends Model {
  @IsNotEmpty()
  training_id: any;
  emp_id: any;
  start_week : any;
  end_week : any;
  completed_videos: Number;
  constructor(body: any) {
    super();
    const {
      training_id,
      emp_id,
    } = body;
    this.training_id = training_id;
    this.emp_id = emp_id;
    
  }

}



