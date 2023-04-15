import { Model } from "../../../model";

export class CategoryModel extends Model {

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

