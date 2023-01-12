import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from 'mongoose';
import {User, UserDocument} from "./user.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {Role, RoleDocument} from "../role/role.model";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as bcrypt from 'bcryptjs'
import {FileService} from "../file/file.service";
import {RoleType} from "../role/role.types";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        private readonly fileService: FileService
    ) {}

    async getAll(): Promise<UserDocument[]> {
        return this.userModel.find().populate('role')
    }

    async getById(id: Types.ObjectId): Promise<UserDocument> {
        return this.userModel.findById(id).populate('role')
    }

    async getByEmail(email: string): Promise<UserDocument> {
        return this.userModel.findOne({email}).populate('role')
    }

    async getByUsername(username: string): Promise<UserDocument> {
        return this.userModel.findOne({username}).populate('role')
    }

    async getByActivationLink(activationLink: string) {
        return this.userModel.findOne({activationLink}).populate('role')
    }

    async getManyByUsername(username: string) {
        return this.userModel.aggregate([
            {$match: {'username': new RegExp(username, 'gi')}}
        ])
    }

    async create(dto: CreateUserDto): Promise<UserDocument> {
        const role = await this.roleModel.findOne({value: "user"})
        return this.userModel.create({...dto, role})
    }

    async update(id: Types.ObjectId, dto: UpdateUserDto): Promise<UserDocument> {
        const resultDto = {}

        for (const [key, value] of Object.entries(dto))
            if (key !== "role" && key !== 'password')
                resultDto[key] = value

        if (dto.roleValue) {
            const role = await this.roleModel.findOne({value: dto.roleValue})
            if (role) {
                resultDto['role'] = role
            }
            delete resultDto['roleValue']
        }

        if (dto.newPassword && dto.oldPassword) {
            const user = await this.userModel.findById(id)
            const passwordEquals = await bcrypt.compare(dto.oldPassword, user.password)
            if (user && passwordEquals)
                resultDto['password'] = await bcrypt.hash(dto.newPassword, 5)
            else
                throw new BadRequestException({message: "Incorrect old password"})
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

    async subscribe(from: Types.ObjectId, to: Types.ObjectId): Promise<UserDocument[]> {
        const me = await this.getById(from)
        if (!me)
            throw new NotFoundException({message: `User with id ${from} not found`})
        const him = await this.getById(to)
        if (!him)
            throw new NotFoundException({message: `User with id ${to} not found`})
        him.followers.push(me._id)
        me.subscriptions.push(him._id)
        await me.save()
        await him.save()
        return [me, him]
    }

    async unsubscribe(from: Types.ObjectId, to: Types.ObjectId): Promise<UserDocument[]> {
        const me = await this.getById(from)
        if (!me)
            throw new NotFoundException({message: `User with id ${from} not found`})
        const him = await this.getById(to)
        if (!him)
            throw new NotFoundException({message: `User with id ${to} not found`})
        him.followers = him.followers.filter(followerId => String(followerId) !== String(me._id))
        me.subscriptions = me.subscriptions.filter(subscriptionId => String(subscriptionId) !== String(him._id))
        await me.save()
        await him.save()
        return [me, him]
    }

    async giveRole(id: Types.ObjectId, roleValue: RoleType): Promise<UserDocument> {
        const role = await this.roleModel.findOne({value: roleValue})
        if (!role) {
            throw new NotFoundException(`Role with value = ${roleValue} not found`)
        }
        const user = await this.getById(id)
        if (!user) {
            throw new NotFoundException(`User with id = ${id} not exists`)
        }
        user.role = role
        await user.save()

        return user
    }


}
