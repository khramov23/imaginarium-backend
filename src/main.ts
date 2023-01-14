import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT
  app.useGlobalPipes(
      new ValidationPipe(),
  );
  app.use(cookieParser())
  app.enableCors({
    credentials: true,
  })
  await app.listen(PORT, () => console.log("server started on PORT " + PORT));
}
bootstrap();
