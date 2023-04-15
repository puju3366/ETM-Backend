import * as _ from "lodash";
import { Category } from "./categorySchema";
export class CategoryUtils {
  request: any;

 
  // Get event details by id
  public async getAllLocations(req: any) {
    return await Category.find({status:1})
  }

}