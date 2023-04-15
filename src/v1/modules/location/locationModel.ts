import { Model } from "../../../model";

export class LocationModel extends Model {

    public name: string;
    public status: number;
    
    constructor(body: any) {
    super();
    const {
      name,
      status
    } = body;
    this.name = name;
    this.status = status;
  }

}

