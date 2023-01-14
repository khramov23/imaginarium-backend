import { RoleType } from '../../role/role.types';
import { Tokens } from '../../token/token.type';
import { UserResponse } from '../dto/user-response.dto';
import {Types} from "mongoose";

export interface UserInfo {
  _id: Types.ObjectId;
  isActivated: string;
  role: RoleType;
}

export interface UserInfoWithTokens extends Tokens {
  user: UserResponse;
}
