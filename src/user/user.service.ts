import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';
import {User, UserDocument} from "./user.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {Role, RoleDocument} from "../role/role.model";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>
    ) {}

    async getAll(): Promise<UserDocument[]> {
        return this.userModel.find()
    }

    async getById(id: Types.ObjectId): Promise<UserDocument> {
        return this.userModel.findById(id)
    }

    async getByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({email})
    }

    async create(dto: CreateUserDto): Promise<UserDocument> {
        const role = await this.roleModel.findOne({value: "user"})
        return this.userModel.create({...dto, role})
    }

    async update(id: Types.ObjectId, dto: UpdateUserDto): Promise<UserDocument> {
        let role
        if (dto.roleValue)
            role = await this.roleModel.findOne({value: dto.roleValue})
        if (!role)
            return this.userModel.findByIdAndUpdate(id, {...dto}, {new: true})
        return this.userModel.findByIdAndUpdate(id, {...dto, role}, {new: true})
    }

    async delete(id: Types.ObjectId): Promise<UserDocument> {
        return this.userModel.findByIdAndDelete(id)
    }
}
