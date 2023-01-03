import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @IsEmail({}, {message: "Invalid email address"})
    readonly email: string

    @IsString({message: "Username should be string"})
    @Length(4, 20, {message: "Username length should be between 4 and 20"})
    readonly username: string

    @IsString({message: "Password should be string"})
    @Length(4, 16, {message: "Password length should be between 4 and 16"})
    readonly password: string

}