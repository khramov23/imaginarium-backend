import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model, Types} from 'mongoose';
import {Tag, TagDocument} from "./tag.model";
import {CreateTagDto} from "./dto/create-tag.dto";

@Injectable()
export class TagService {

    constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {
    }

    async getAll(): Promise<TagDocument[]> {
        return this.tagModel.find()
    }

    async deleteAll() {
        return this.tagModel.deleteMany()
    }

    async create(dto: CreateTagDto): Promise<TagDocument> {
        return this.tagModel.create({...dto, count: 0})
    }

    async delete(id: Types.ObjectId): Promise<TagDocument> {
        return this.tagModel.findByIdAndDelete(id)
    }

    async incrementCountByTagValue(tagValue: string): Promise<TagDocument> {
        let tag = await this.tagModel.findOne({value: tagValue})
        if (tag) {
            tag.count += 1
            await tag.save()
        } else {
            tag = await this.tagModel.create({value: tagValue, count: 1})
        }
        return tag
    }

    async decrementCountById(id: string): Promise<TagDocument> {
        let tag = await this.tagModel.findById(id)
        if (tag && tag.count > 1) {
            tag.count -= 1
            await tag.save()
        } else if (tag.count === 1) {
            tag = await this.tagModel.findByIdAndDelete(id)
        } else {
            throw new NotFoundException("Tag with id " + id + " not found")
        }
        return tag
    }
}
