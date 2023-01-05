import {Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {ImageService} from "./image.service";
import {CreateImageDto} from "./dto/create-image.dto";
import {SearchParams} from "../validators/param.validator";
import {FileInterceptor} from "@nestjs/platform-express";
import {User} from "../user/decorators/user.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";

@Controller('images')
export class ImageController {

    constructor(private readonly imageService: ImageService) {}

    @Get()
    getAll() {
        return this.imageService.getAll()
    }

    @Delete()
    @Roles('admin')
    @UseGuards(RolesGuard)
    deleteAll() {
        return this.imageService.deleteAll()
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    create(@User('_id') userId, @Body() dto: CreateImageDto, @UploadedFile() image) {
        return this.imageService.create(userId, dto, image)
    }

    @Delete(':id')
    @Roles('manager', 'admin')
    @UseGuards(RolesGuard)
    delete(@Param() params: SearchParams) {
        return this.imageService.delete(params.id)
    }

}