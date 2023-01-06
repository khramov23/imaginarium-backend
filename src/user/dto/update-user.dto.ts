import {IsEmail, IsOptional, IsString, Length} from "class-validator";

export class UpdateUserDto {

    @IsOptional()
    @IsEmail({}, {message: "Invalid email address"})
    readonly email?: string

    @IsOptional()
    @IsString({message: "Username should be string"})
    @Length(4, 20, {message: "Username length should be between 4 and 20"})
    readonly username?: string

    @IsOptional()
    @IsString({message: "Password should be string"})
    @Length(4, 16, {message: "Password length should be between 4 and 16"})
    readonly oldPassword?: string

    @IsOptional()
    @IsString({message: "Password should be string"})
    @Length(4, 16, {message: "Password length should be between 4 and 16"})
    readonly newPassword?: string

    @IsOptional()
    @IsString({message: "Role value should be string"})
    readonly roleValue?: string

}