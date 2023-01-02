import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {Role} from "../role/role.model";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @Prop({ unique: true })
    username: string;

    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string

    @Prop({type: Types.ObjectId, ref: Role.name})
    role: Role
}

export const UserSchema = SchemaFactory.createForClass(User);