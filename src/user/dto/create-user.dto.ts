import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @IsEmail({}, {message: "Invalid email address"})
    readonly email: string

    @IsString({message: "Username should be string"})
    @Length(3, 20, {message: "Username length should be between 3 and 20"})
    readonly username: string

    @IsString({message: "Password should be string"})
    @Length(6, 16, {message: "Password length should be between 6 and 16"})
    readonly password: string

}