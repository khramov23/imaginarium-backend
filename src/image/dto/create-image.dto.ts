import {Types} from "mongoose";
import {IsArray, IsString} from "class-validator";

export class CreateImageDto {

    @IsString({message: "Title should be string"})
    readonly title: string

    @IsString({message: "User id should be string"})
    readonly userId: Types.ObjectId

    @IsArray({message: "Tag Values should be array"})
    @IsString({each: true, message: "Every tag in array should be string"})
    readonly tagValues: string[]
}