import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post, UploadedFile,
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Roles} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {SearchParams} from "../validators/param.validator";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {User} from "./decorators/user.decorator";
import {Types} from "mongoose";
import {FileInterceptor} from "@nestjs/platform-express";
import {AuthService} from "../auth/auth.service";
import {UpdatePasswordDto} from "./dto/update-password.dto";

@Controller('users')
@UsePipes(ValidationPipe)
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getAll() {
        return this.userService.getAll()
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getById(@Param() params: SearchParams) {
        return this.userService.getById(params.id)
    }

    @Post()
    @Roles('admin')
    @UseGuards(RolesGuard)
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto)
    }

    @Delete(':id')
    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    delete(@Param() params: SearchParams) {
        return this.userService.delete(params.id)
    }

    @Patch(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    update(@Param() params: SearchParams, @Body() dto: UpdateUserDto) {
        return this.userService.update(params.id, dto)
    }

    @Post('/update-password')
    @UseGuards(JwtAuthGuard)
    updatePassword(@User('_id') id: Types.ObjectId, @Body() dto: UpdatePasswordDto) {
        return this.userService.update(id, dto)
    }

    @Post('/add-avatar')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('avatar'))
    addAvatar(@User('_id') id: Types.ObjectId, @UploadedFile() avatar) {
        return this.userService.addAvatar(id, avatar)
    }

    @Post('/subscribe/:id')
    @UseGuards(JwtAuthGuard)
    subscribe(@User('_id') id: Types.ObjectId, @Param() params: SearchParams) {
        return this.userService.subscribe(id, params.id)
    }

    @Post('/unsubscribe/:id')
    @UseGuards(JwtAuthGuard)
    unsubscribe(@User('_id') id: Types.ObjectId, @Param() params: SearchParams) {
        return this.userService.unsubscribe(id, params.id)
    }

}
