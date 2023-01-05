import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from 'mongoose';
import {User, UserDocument} from "./user.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {Role, RoleDocument} from "../role/role.model";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as bcrypt from 'bcryptjs'
import {FileService} from "../file/file.service";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        private readonly fileService: FileService
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
        const resultDto = {}
        for (const [key, value] of Object.entries(dto))
            if (key !== "role")
                resultDto[key] = value

        if (dto.roleValue) {
            const role = await this.roleModel.findOne({value: dto.roleValue})
            if (role) {
                resultDto['role'] = role
            }
            delete resultDto['roleValue']
        }

        if (dto.password) {
            resultDto['password'] = await bcrypt.hash(dto.password, 5)
        }
        return this.userModel.findByIdAndUpdate(id, {...resultDto}, {new: true})
    }

    async delete(id: Types.ObjectId): Promise<UserDocument> {
        return this.userModel.findByIdAndDelete(id)
    }

    async addAvatar(id: Types.ObjectId, avatar: Express.Multer.File): Promise<UserDocument> {
        const avatarPath = await this.fileService.createFile(avatar, 'avatars')
        const user = await this.userModel.findByIdAndUpdate(id, {avatar: avatarPath}, {new: true})
        return user
    }
}
