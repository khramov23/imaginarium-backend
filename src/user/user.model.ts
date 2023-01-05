import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {Role} from "../role/role.model";
import {Image} from "../image/models/image.model";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ unique: true })
    username: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string

    @Prop()
    avatar: string

    @Prop([{ type: Types.ObjectId, ref: User.name }])
    followers: Types.ObjectId[]

    @Prop([{ type: Types.ObjectId, ref: User.name }])
    subscriptions: Types.ObjectId[]

    @Prop([{ type: Types.ObjectId, ref: Image.name }])
    favorites: Types.ObjectId[]

    @Prop([{ type: Types.ObjectId, ref: Image.name }])
    own: Types.ObjectId[]

    @Prop({type: Types.ObjectId, ref: Role.name})
    role: Role
}

export const UserSchema = SchemaFactory.createForClass(User);