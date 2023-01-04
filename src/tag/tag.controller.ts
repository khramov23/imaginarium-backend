import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {TagService} from "./tag.service";
import {CreateTagDto} from "./dto/create-tag.dto";
import {SearchParams} from "../validators/param.validator";

@Controller('tags')
export class TagController {

  constructor(private readonly tagService: TagService) {}

  @Get()
  getAll() {
    return this.tagService.getAll()
  }

  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto)
  }

  @Delete(':id')
  delete(@Param() params: SearchParams) {
    return this.tagService.delete(params.id)
  }
}
