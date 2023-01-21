import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Image, ImageDocument} from "./models/image.model";
import {Model, Types} from "mongoose";
import {CreateImageDto} from "./dto/create-image.dto";
import {FileService} from "../file/file.service";
import {TagService} from "../tag/tag.service";
import {ColorsService} from "../colors/colors.service";
import {UserService} from "../user/user.service";
import {ColorName} from "../colors/colors.types";
import {PaginationParams} from "../validators/pagination.validator";
import {Tag} from "../tag/tag.model";

@Injectable()
export class ImageService {

    constructor(
        @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
        private readonly userService: UserService,
        private readonly tagService: TagService,
        private readonly fileService: FileService,
        private readonly colorsService: ColorsService
    ) {
    }

    async getAll({limit = 100, page = 0}: PaginationParams): Promise<ImageDocument[]> {
        return this.imageModel.find().skip(+page * +limit).limit(+limit).populate('tags')
    }

    async getById(id: Types.ObjectId): Promise<ImageDocument> {
        return this.imageModel.findById(id).populate('tags')
    }

    async getFavoritesByUserId(userId: Types.ObjectId, {
        limit = 100,
        page = 0
    }: PaginationParams): Promise<ImageDocument[]> {
        const user = await this.userService.getById(userId)
        return this.imageModel.find({'_id': {$in: user.favorites}}).skip(+page * +limit).limit(+limit).populate('tags')
    }

    async getOwnByUserId(userId: Types.ObjectId, {limit = 100, page = 0}: PaginationParams): Promise<ImageDocument[]> {
        const user = await this.userService.getById(userId)
        return this.imageModel.find({'_id': {$in: user.own}}).skip(+page * +limit).limit(+limit).populate('tags')
    }

    async getOneByTag(tagValue: string) {
        const tag = await this.tagService.getByTagValue(tagValue)
        if (!tag)
            throw new BadRequestException({message: "There is not tag with value " + tagValue})
        // return this.imageModel.findOne({tags: tag._id})
        return this.imageModel.aggregate([
            {$match: {"tags": tag._id}},
            {$addFields: {"tag": tag.value}},
            {$sort: {'likes': -1}},
            {$limit: 1},
        ])
    }

    async getOneByTagId(id: Types.ObjectId): Promise<ImageDocument> {
        const tag = await this.tagService.getById(id)
        if (!tag)
            throw new BadRequestException({message: "There is not tag with value " + tag.value})
        return this.imageModel.findOne({tags: tag._id}).populate('tags')
    }

    async getManyByTag(tagValue: string, {limit = 100, page = 0}: PaginationParams): Promise<ImageDocument[]> {
        const tag = await this.tagService.getByTagValue(tagValue)
        if (!tag)
            throw new BadRequestException({message: "There is not tag with value " + tagValue})
        return this.imageModel.find({tags: tag._id}).skip(+page * +limit).limit(+limit).populate('tags')
    }

    async getByTitle(title: string, {limit = 100, page = 0}: PaginationParams): Promise<ImageDocument[]> {
        return this.imageModel.find({title: new RegExp(title, 'gi')}).skip(+page * +limit).limit(+limit).populate('tags')
    }

    async getByColor(color: ColorName, {limit = 100, page = 0}: PaginationParams) {
        return this.imageModel.aggregate([
            {$match: {[`colors.${color}`]: {$gte: 30}}},
            {$lookup: {from: "tags", localField: 'tags', foreignField: "_id", as: 'tags'}}
        ]).skip(+page * +limit).limit(+limit)
    }

    async getByPopularTags() {
        const tags = await this.tagService.getPopular()
        const tagValues = tags.map(tag => tag.value)
        const images = []
        for (const value of tagValues) {
            images.push(await this.getOneByTag(value))
        }
        return images
    }

    async getFeed(id: Types.ObjectId, {limit = 100, page = 0}: PaginationParams): Promise<ImageDocument[]> {
        const user = await this.userService.getById(id)
        return this.imageModel.find({'author': {$in: user.subscriptions}})
            .sort({'date': -1})
            .skip(+page * +limit)
            .limit(+limit)
            .populate('tags')
    }

    async deleteAll() {
        await this.tagService.deleteAll()
        return this.imageModel.deleteMany()
    }

    async create(userId: Types.ObjectId, dto: CreateImageDto, image: Express.Multer.File): Promise<ImageDocument> {
        const src = await this.fileService.createFile(image)
        const user = await this.userService.getById(userId)
        if (!user) {
            throw new NotFoundException({message: "User with this Id not found"})
        }

        const tags = []
        for (const tagValue of dto.tagValues) {
            const tag = await this.tagService.incrementCountByTagValue(tagValue)
            tags.push(tag)
        }

        const imageInfo = await this.colorsService.getImageInfo(src)

        const img = await this.imageModel.create({
            src,
            author: user,
            title: dto.title,
            width: imageInfo.width,
            height: imageInfo.height,
            colors: imageInfo.colors,
            likes: 0,
            tags,
            date: Date.now()
        })

        user.own.push(img._id)
        await user.save()

        return img
    }

    async delete(id: Types.ObjectId) {
        const image = await this.imageModel.findById(id)
        for (const tagId of image.tags)
            await this.tagService.decrementCountById(String(tagId))
        return image.delete()
    }

    async like(userId: Types.ObjectId, imageId: Types.ObjectId): Promise<ImageDocument> {
        const user = await this.userService.getById(userId)
        const image = await this.imageModel.findById(imageId)

        const alreadyLiked = !!user.favorites.find(id => String(id) === String(image._id))

        if (!alreadyLiked) {
            user.favorites.push(image._id)
            image.likes += 1
        } else {
            user.favorites = user.favorites.filter(id => String(id) !== String(image._id))
            image.likes -= 1
        }

        await user.save()
        await image.save()

        return image
    }



}
