import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UserModule} from "../user/user.module";
import {JwtModule} from "@nestjs/jwt";
import {ConfigModule} from "@nestjs/config";
import {TokenModule} from "../token/token.module";
import {MailModule} from "../mail/mail.module";

@Module({
    imports: [
        ConfigModule.forRoot(),
        forwardRef(() => UserModule),
        JwtModule.register({}),
        TokenModule,
        MailModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {
}
