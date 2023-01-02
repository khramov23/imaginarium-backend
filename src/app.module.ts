import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {MongooseModule} from "@nestjs/mongoose";
import {getMongoConfig} from "./config/mongo.config";
import {RoleModule} from './role/role.module';
import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';

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
        AuthModule
    ],
})
export class AppModule {
}
