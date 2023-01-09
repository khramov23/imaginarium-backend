import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {User} from "../user/user.model";

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {
    @Prop({type: Types.ObjectId, ref: User.name})
    user: string;

    @Prop({ required: true})
    refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);