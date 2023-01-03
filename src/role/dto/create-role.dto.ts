import {IsString} from "class-validator";

export class CreateRoleDto {
    @IsString({message: "Value should be string"})
    readonly value: string

    @IsString({message: "Description should be string"})
    readonly description: string
}