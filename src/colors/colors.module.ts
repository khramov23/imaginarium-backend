import {Module} from '@nestjs/common';
import {ColorsService} from './colors.service';
import {MongooseModule} from "@nestjs/mongoose";
import {Colors, ColorsSchema} from "./colors.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Colors.name, schema: ColorsSchema}
        ])
    ],
    providers: [ColorsService],
    exports: [ColorsService]
})
export class ColorsModule {
}
