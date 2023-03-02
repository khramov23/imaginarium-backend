import {IsString} from "class-validator";

export class AddAvatarDto {

    @IsString()
    readonly size: string

    @IsString()
    readonly left: string

    @IsString()
    readonly top: string

}