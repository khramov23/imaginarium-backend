import { Module } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {getMongoConfig} from "./config/mongo.config";

@Module({
  imports: [
      ConfigModule.forRoot(),
      MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: getMongoConfig
      })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
