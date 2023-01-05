import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TagDocument = HydratedDocument<Tag>;

@Schema()
export class Tag {
    @Prop({ unique: true })
    value: string;

    @Prop()
    count: number

}

export const TagSchema = SchemaFactory.createForClass(Tag);