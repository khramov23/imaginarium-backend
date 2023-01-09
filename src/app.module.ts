import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from "@nestjs/mongoose";
import {getMongoConfig} from "./config/mongo.config";
import {RoleModule} from './role/role.module';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import { TagModule } from './tag/tag.module';
import { ImageModule } from './image/image.module';
import { FileModule } from './file/file.module';
import { ColorsModule } from './colors/colors.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { TokenModule } from './token/token.module';
import { MailModule } from './mail/mail.module';
import * as path from "path";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoConfig
        }),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, "static")
        }),
        RoleModule,
        UserModule,
        AuthModule,
        TagModule,
        ImageModule,
        FileModule,
        ColorsModule,
        TokenModule,
        MailModule
    ],
})
export class AppModule {
}
