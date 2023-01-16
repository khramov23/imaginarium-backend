import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {User} from "../../user/user.model";
import {Colors} from "../../colors/colors.model";
import {Tag} from "../../tag/tag.model";
import * as mongoose from "mongoose";

export type ImageDocument = HydratedDocument<Image>;

@Schema()
export class Image {
    @Prop({ unique: true })
    src: string;

    @Prop({ type: Types.ObjectId, ref: "User" })
    author: User;

    @Prop()
    title: string

    @Prop()
    width: number

    @Prop()
    height: number

    @Prop({ type: Types.ObjectId, ref: Colors.name })
    colors: Colors

    @Prop()
    likes: number

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: Tag.name }])
    tags: Tag[]
}

export const ImageSchema = SchemaFactory.createForClass(Image);