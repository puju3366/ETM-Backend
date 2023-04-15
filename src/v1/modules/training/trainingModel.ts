import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import { Document, model, Schema } from "mongoose";
import {
  IsMediaSizeValidConstraint,
} from "./trainingValidator";
import { Model } from "../../../model";

export class TrainingModel extends Model {

  @IsNotEmpty()
  public trainingname: string;
  @IsNotEmpty()
  public platform: string;
  @IsOptional()
  public mentor: [Schema.Types.ObjectId];
  public status: number;
  courselink: any;

  constructor(body: any) {
    super();
    const {
      trainingname,
      platform,
      courselink,
      focus_area,
      level,
      no_of_video,
      startdate,
      endate,
      mentor,
      status,
      emp_id
    } = body;
    this.trainingname = trainingname;
    this.platform = platform;
	  this.courselink = courselink;
    
  }

}

export class UserUpdateModel extends Model {

  @IsNotEmpty()
  public trainingname: string;

  @IsNotEmpty()
  public platform: string;

  @IsNotEmpty()
  public courselink: string;

  @IsNotEmpty()
  public focus_area: string;

  @IsNotEmpty()
  public mentor: [Schema.Types.ObjectId];


  constructor(body: any) {
    super();
    const {
      trainingname,
      platform,
      courselink,
      focus_area,
      mentor,   
    } = body;
    this.trainingname = trainingname;
    this.platform = platform;
    this.courselink = courselink;
    this.focus_area = focus_area;
    this.mentor = mentor;
  }
}

