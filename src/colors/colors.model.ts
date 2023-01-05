import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument} from 'mongoose';

export type ColorsDocument = HydratedDocument<Colors>;

@Schema()
export class Colors {
    @Prop()
    red: number;

    @Prop()
    green: number;

    @Prop()
    blue: number;

    @Prop()
    cyan: number;

    @Prop()
    pink: number;

    @Prop()
    yellow: number;

    @Prop()
    black: number;

    @Prop()
    white: number;
}

export const ColorsSchema = SchemaFactory.createForClass(Colors);