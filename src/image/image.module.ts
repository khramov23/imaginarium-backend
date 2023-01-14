import {forwardRef, Module} from '@nestjs/common';
import {ImageController} from './image.controller';
import {ImageService} from './image.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Image, ImageSchema} from "./models/image.model";
import {UserModule} from "../user/user.module";
import {TagModule} from "../tag/tag.module";
import {FileModule} from "../file/file.module";
import {ColorsModule} from "../colors/colors.module";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Image.name, schema: ImageSchema},
        ]),
        FileModule,
        UserModule,
        forwardRef(() => TagModule),
        ColorsModule,
        AuthModule
    ],
    controllers: [ImageController],
    providers: [ImageService]
})
export class ImageModule {
}
