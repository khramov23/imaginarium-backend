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
import {PaginationParams} from "../validators/pagination.validator";
import {UserResponse} from "../auth/dto/user-response.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        private readonly fileService: FileService
    ) {}

    async getAll({limit = 100, page = 0}: PaginationParams): Promise<UserDocument[]> {
        return this.userModel.find().populate('role').skip(+page * +limit).limit(limit)
    }

    async getById(id: Types.ObjectId): Promise<UserDocument> {
        return this.userModel.findById(id).populate('role')
    }

    async getByIdInfo(id: Types.ObjectId): Promise<UserResponse> {
        const user = await this.userModel.findById(id).populate('role')
        return new UserResponse(user)
    }

    async getAllInfo({limit = 100, page = 0}: PaginationParams): Promise<UserResponse[]> {
        const users = await this.userModel.find().populate('role').skip(+page * +limit).limit(limit)
        const response = users.map(user => new UserResponse(user))
        return response
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

    async getManyByUsername(username: string, {limit = 100, page = 0}: PaginationParams) {
        return this.userModel.aggregate([
            {$match: {'username': new RegExp(username, 'gi')}}
        ]).skip(+page * +limit).limit(+limit)
    }

    async getSubscriptions(id: Types.ObjectId, {limit = 100, page = 0}: PaginationParams): Promise<UserDocument[]> {
        const user = await this.userModel.findById(id)
        return this.userModel.find({ '_id': { $in: user.subscriptions } }).skip(+page * +limit).limit(+limit);
    }

    async getFollowers(id: Types.ObjectId, {limit = 100, page = 0}: PaginationParams): Promise<UserDocument[]> {
        const user = await this.userModel.findById(id)
        return this.userModel.find({ '_id': { $in: user.followers } }).skip(+page * +limit).limit(+limit);
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

    async subscribe(from: Types.ObjectId, to: Types.ObjectId): Promise<UserResponse[]> {
        const me = await this.getById(from)
        if (!me)
            throw new NotFoundException({message: `User with id ${from} not found`})
        const him = await this.getById(to)
        if (!him)
            throw new NotFoundException({message: `User with id ${to} not found`})

        if (him.followers.includes(me._id))
            him.followers = him.followers.filter(follower => String(follower._id) !== String(me._id))
        else
            him.followers.push(me._id)

        if (me.subscriptions.includes(him._id))
            me.subscriptions = me.subscriptions.filter(subs => String(subs._id) !== String(him._id))
        else
            me.subscriptions.push(him._id)

        await me.save()
        await him.save()
        return [me, him].map(user => new UserResponse(user))
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
