import {Module} from '@nestjs/common';
import {TagService} from './tag.service';
import {TagController} from './tag.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Tag, TagSchema} from "./tag.model";
import {User, UserSchema} from "../user/user.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Tag.name, schema: TagSchema},
        ])
    ],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService]
})
export class TagModule {
}
