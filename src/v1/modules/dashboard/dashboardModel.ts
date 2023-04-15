 import {
  IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import {
  IsMediaSizeValidConstraint,
} from "./dashboardValidator";
import { Model } from "../../../model";

export class DashboardModel extends Model {
  training_id: any;
  emp_id: any;

  

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

export class UserUpdateModel extends Model {

  @IsNotEmpty()
  public training_id: string;

  @IsNotEmpty()
  public emp_id: string;

 


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

