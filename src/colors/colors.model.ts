import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument, Types} from 'mongoose';
import {Role} from "../role/role.model";
import {User} from "../user/user.model";
import {Image} from "../image/models/image.model";
import {IsInt, Length, Max, Min} from "class-validator";

export type ColorsDocument = HydratedDocument<Colors>;

@Schema()
export class Colors {
    @Prop()
    @IsInt({message: "Color should be an integer"})
    @Min(0, {message: 'Min value is 0'})
    @Max(255, {message: 'Max value is 255'})
    red: number;

    @Prop()
    @IsInt({message: "Color should be an integer"})
    @Min(0, {message: 'Min value is 0'})
    @Max(255, {message: 'Max value is 255'})
    @Prop()
    green: number;

    @Prop()
    @IsInt({message: "Color should be an integer"})
    @Min(0, {message: 'Min value is 0'})
    @Max(255, {message: 'Max value is 255'})
    @Prop()
    blue: number;

    @Prop()
    @IsInt({message: "Color should be an integer"})
    @Min(0, {message: 'Min value is 0'})
    @Max(255, {message: 'Max value is 255'})
    @Prop()
    cyan: number;

    @Prop()
    @IsInt({message: "Color should be an integer"})
    @Min(0, {message: 'Min value is 255'})
    @Max(255, {message: 'Max value is 0'})
    @Prop()
    pink: number;

    @Prop()
    @IsInt({message: "Color should be an integer"})
    @Min(0, {message: 'Min value is 0'})
    @Max(255, {message: 'Max value is 255'})
    @Prop()
    yellow: number;

    @Prop()
    @IsInt({message: "Color should be an integer"})
    @Min(0, {message: 'Min value is 0'})
    @Max(255, {message: 'Max value is 255'})
    @Prop()
    black: number;

    @Prop()
    @IsInt({message: "Color should be an integer"})
    @Min(0, {message: 'Min value is 0'})
    @Max(255, {message: 'Max value is 255'})
    @Prop()
    white: number;
}

export const ColorsSchema = SchemaFactory.createForClass(Colors);