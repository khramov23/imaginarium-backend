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

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoConfig
        }),
        RoleModule,
        UserModule,
        AuthModule,
        TagModule,
        ImageModule,
        FileModule,
        ColorsModule
    ],
})
export class AppModule {
}
