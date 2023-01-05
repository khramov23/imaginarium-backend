import {Module} from '@nestjs/common';
import {ImageController} from './image.controller';
import {ImageService} from './image.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Image, ImageSchema} from "./models/image.model";
import {Colors, ColorsSchema} from "../colors/colors.model";
import {UserModule} from "../user/user.module";
import {TagModule} from "../tag/tag.module";
import {FileModule} from "../file/file.module";
import {User, UserSchema} from "../user/user.model";
import {Tag, TagSchema} from "../tag/tag.model";
import {ColorsModule} from "../colors/colors.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Image.name, schema: ImageSchema},
            {name: Colors.name, schema: ColorsSchema},
            {name: User.name, schema: UserSchema},
            {name: Tag.name, schema: TagSchema},
        ]),
        FileModule,
        UserModule,
        TagModule,
        ColorsModule
    ],
    controllers: [ImageController],
    providers: [ImageService]
})
export class ImageModule {
}
