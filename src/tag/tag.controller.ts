import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {TagService} from "./tag.service";
import {CreateTagDto} from "./dto/create-tag.dto";
import {SearchParams} from "../validators/param.validator";
import {Roles} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";

@Controller('tags')
export class TagController {

  constructor(private readonly tagService: TagService) {}

  @Get()
  getAll() {
    return this.tagService.getAll()
  }

  @Delete()
  @Roles('admin')
  @UseGuards(RolesGuard)
  deleteAll() {
    return this.tagService.deleteAll()
  }

  @Post()
  @Roles('admin')
  @UseGuards(RolesGuard)
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto)
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  delete(@Param() params: SearchParams) {
    return this.tagService.delete(params.id)
  }
}
