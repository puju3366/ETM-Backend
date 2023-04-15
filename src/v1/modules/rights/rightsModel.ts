import {
    IsEmail, IsNotEmpty, Validate, MaxLength, IsOptional
} from "class-validator";
import {

} from "./rightsValidator";
import { Model } from "../../../model";

export class RightModel extends Model {

    @IsNotEmpty()
    public name: string;
    @IsOptional()
    public slug: string;
    @IsOptional()
    public moduleID: string;

    @IsOptional()
    public status: number;

    constructor(body: any) {
        super();
        const {
            name,
            slug,
            moduleID,
            status,
        } = body;
        this.name = name;
        this.slug = slug;
        this.moduleID = moduleID;
        this.status = status;

    }

}



