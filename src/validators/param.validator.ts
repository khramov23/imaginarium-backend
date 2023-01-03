import {IsOptional, IsString} from "class-validator";
import {Types} from "mongoose";

export class SearchParams {
    @IsOptional()
    @IsString({message: "ID should be Types.ObjectId"})
    id: Types.ObjectId
}
