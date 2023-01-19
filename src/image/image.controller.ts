import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ImageService} from "./image.service";
import {CreateImageDto} from "./dto/create-image.dto";
import {SearchParams} from "../validators/param.validator";
import {FileInterceptor} from "@nestjs/platform-express";
import {User} from "../user/decorators/user.decorator";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {ColorName} from "../colors/colors.types";
import {PaginationParams} from "../validators/pagination.validator";

@Controller('images')
export class ImageController {

    constructor(private readonly imageService: ImageService) {}

    @Get()
    getAll(@Query() query: PaginationParams) {
        return this.imageService.getAll(query)
    }

    @Get('/by-tags')
    getByPopularTags() {
        return this.imageService.getByPopularTags()
    }

    @Get('/by-id/:id')
    getById(@Param() params: SearchParams) {
        return this.imageService.getById(params.id)
    }

    @Get('/by-tag/:tagValue')
    getOneByTag(@Param('tagValue') tagValue: string) {
        return this.imageService.getOneByTag(tagValue)
    }

    @Get('/by-tag-id/:id')
    getOneByTagId(@Param() params: SearchParams) {
        return this.imageService.getOneByTagId(params.id)
    }

    @Get('/many-by-tag/:tagValue')
    getManyByTag(@Param('tagValue') tagValue: string, @Query() query: PaginationParams) {
        return this.imageService.getManyByTag(tagValue, query)
    }

    @Get("/favorites/:id")
    getFavoritesByUserId(@Param() params: SearchParams, @Query() query: PaginationParams) {
        return this.imageService.getFavoritesByUserId(params.id, query)
    }

    @Get("/own/:id")
    getOwnByUserId(@Param() params: SearchParams, @Query() query: PaginationParams) {
        return this.imageService.getOwnByUserId(params.id, query)
    }

    @Get('/by-title/:title')
    getByTitle(@Param("title") title: string, @Query() query: PaginationParams) {
        return this.imageService.getByTitle(title, query)
    }

    @Get('/by-color/:color')
    getByColor(@Param("color") color: ColorName, @Query() query: PaginationParams) {
        return this.imageService.getByColor(color, query)
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

    @Post("/likes/:id")
    @UseGuards(JwtAuthGuard)
    like(@User('_id') userId, @Param() params: SearchParams) {
        return this.imageService.like(userId, params.id)
    }

    @Delete(':id')
    @Roles('manager', 'admin')
    @UseGuards(RolesGuard)
    delete(@Param() params: SearchParams) {
        return this.imageService.delete(params.id)
    }

}
