import * as _ from "lodash";
import { Location } from "./locationSchema";
export class LocationUtils {
  request: any;

 
  // Get event details by id
  public async getAllLocations(req: any) {
    return await Location.find({status:1})
  }

}