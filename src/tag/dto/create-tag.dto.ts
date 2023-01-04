import {IsString} from "class-validator";

export class CreateTagDto {

    @IsString({message: "Tag value should be string"})
    value: string

}
