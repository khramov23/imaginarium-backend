import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
    ValidationPipe
} from '@nestjs/common';
import {ImageService} from "./image.service";
import {CreateImageDto} from "./dto/create-image.dto";
import {SearchParams} from "../validators/param.validator";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('images')
export class ImageController {

    constructor(private readonly imageService: ImageService) {}

    @Get()
    getAll() {
        return this.imageService.getAll()
    }

    @Delete()
    deleteAll() {
        return this.imageService.deleteAll()
    }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    create(@Body() dto: CreateImageDto, @UploadedFile() image) {
        return this.imageService.create(dto, image)
    }

    @Delete(':id')
    delete(@Param() params: SearchParams) {
        return this.imageService.delete(params.id)
    }

}
