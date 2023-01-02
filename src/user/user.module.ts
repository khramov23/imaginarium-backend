import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.model";
import {Role, RoleSchema} from "../role/role.model";

@Module({
  imports: [
      MongooseModule.forFeature([
          {name: User.name, schema: UserSchema},
          {name: Role.name, schema: RoleSchema}
      ])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
