import {CreateUserDto} from "../../user/dto/create-user.dto";
import {IsString, IsUUID} from "class-validator";

export class RegistrationDto extends CreateUserDto {
    @IsString({message: "Activation link should be string"})
    @IsUUID('4', {message: 'Activation link should be UUID'})
    activationLink: string
}