import {forwardRef, Module} from '@nestjs/common';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "./user.model";
import {Role, RoleSchema} from "../role/role.model";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Role.name, schema: RoleSchema}
        ]),
        forwardRef(() => AuthModule)
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [
        UserService,
    ]
})
export class UserModule {
}
