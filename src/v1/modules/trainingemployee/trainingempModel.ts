import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import { Document, model, Schema } from "mongoose";

import {
  IsMediaSizeValidConstraint,
} from "./trainingempValidator";
import { Model } from "../../../model";

export class TrainingEmpModel extends Model {

  @IsNotEmpty()
  public training_id: Schema.Types.ObjectId;
  @IsNotEmpty()
  public emp_id: [Schema.Types.ObjectId];
}
