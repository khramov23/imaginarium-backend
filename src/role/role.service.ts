import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';
import {Role, RoleDocument} from "./role.model";
import {CreateRoleDto} from "./dto/create-role.dto";

@Injectable()
export class RoleService {

    constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

    async getAll(): Promise<RoleDocument[]> {
        return this.roleModel.find()
    }

    async create(dto: CreateRoleDto): Promise<RoleDocument> {
        return this.roleModel.create(dto)
    }

    async delete(id: Types.ObjectId): Promise<RoleDocument> {
        return this.roleModel.findByIdAndDelete(id)
    }
}
