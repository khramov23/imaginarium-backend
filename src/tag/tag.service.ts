import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import { Model, Types } from 'mongoose';
import {Tag, TagDocument} from "./tag.model";
import {CreateTagDto} from "./dto/create-tag.dto";

@Injectable()
export class TagService {

  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  async getAll(): Promise<TagDocument[]> {
    return this.tagModel.find()
  }

  async create(dto: CreateTagDto): Promise<TagDocument> {
    return this.tagModel.create(dto)
  }

  async delete(id: Types.ObjectId): Promise<TagDocument> {
    return this.tagModel.findByIdAndDelete(id)
  }
}
