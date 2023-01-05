import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Role, RoleSchema} from "./role.model";
import {AuthModule} from "../auth/auth.module";

@Module({
  imports: [
      MongooseModule.forFeature([
        {name: Role.name, schema: RoleSchema}
      ]),
      AuthModule
  ],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
