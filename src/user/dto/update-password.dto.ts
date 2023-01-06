import {PickType} from "@nestjs/mapped-types";
import {UpdateUserDto} from "./update-user.dto";

export class UpdatePasswordDto extends PickType(UpdateUserDto, ["oldPassword", "newPassword"]) {}