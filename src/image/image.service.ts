import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Image, ImageDocument} from "./models/image.model";
import {Model, Types} from "mongoose";
import {CreateImageDto} from "./dto/create-image.dto";
import {FileService} from "../file/file.service";
import {TagService} from "../tag/tag.service";
import {ColorsService} from "../colors/colors.service";
import {UserService} from "../user/user.service";

@Injectable()
export class ImageService {

    constructor(
        @InjectModel(Image.name) private imageModel: Model<ImageDocument>,
        private readonly userService: UserService,
        private readonly tagService: TagService,
        private readonly fileService: FileService,
        private readonly colorsService: ColorsService
    ) {}

    async getAll(): Promise<ImageDocument[]> {
        return this.imageModel.find()
    }

    async deleteAll() {
        await this.tagService.deleteAll()
        return this.imageModel.deleteMany()
    }

    async create(userId: Types.ObjectId, dto: CreateImageDto, image: Express.Multer.File): Promise<ImageDocument> {
        const src = await this.fileService.createFile(image)
        const user  = await this.userService.getById(userId)
        if (!user) {
            throw new NotFoundException({message: "User with this Id not found"})
        }

        const tags = []
        for (const tagValue of dto.tagValues) {
            const tag = await this.tagService.incrementCountByTagValue(tagValue)
            tags.push(tag)
        }

        const imageInfo = await this.colorsService.getImageInfo(src)

        return this.imageModel.create({
            src,
            author: user,
            title: dto.title,
            width: imageInfo.width,
            height: imageInfo.height,
            colors: imageInfo.colors,
            likes: 0,
            tags
        })
    }

    async delete(id: Types.ObjectId) {
        const image = await this.imageModel.findById(id)
        for (const tagId of image.tags)
            await this.tagService.decrementCountById(String(tagId))
        return image.delete()
    }

}
