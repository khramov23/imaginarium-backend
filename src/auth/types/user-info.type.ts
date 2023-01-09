import {Tokens} from "../../token/token.type";
import {Types} from "mongoose";
import {Role, RoleDocument} from "../../role/role.model";

export interface UserInfo {
    _id: Types.ObjectId
    role: Role | RoleDocument
    isActivated: boolean
}

export type UserInfoWithTokens = UserInfo | Tokens