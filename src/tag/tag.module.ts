import {Module} from '@nestjs/common';
import {TagService} from './tag.service';
import {TagController} from './tag.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Tag, TagSchema} from "./tag.model";
import {AuthModule} from "../auth/auth.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Tag.name, schema: TagSchema},
        ]),
        AuthModule
    ],
    controllers: [TagController],
    providers: [TagService],
    exports: [TagService]
})
export class TagModule {
}
