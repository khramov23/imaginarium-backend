import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
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
import {UpdatePasswordDto} from "./dto/update-password.dto";
import {RoleType} from "../role/role.types";
import {PaginationParams} from "../validators/pagination.validator";

@Controller('users')
@UsePipes(ValidationPipe)
export class UserController {

    constructor(
        private readonly userService: UserService,
    ) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    getAll(@Query() query: PaginationParams) {
        return this.userService.getAll(query)
    }

    @Get('/get-me')
    @UseGuards(JwtAuthGuard)
    getMe(@User('_id') id: Types.ObjectId) {
        return this.userService.getById(id)
    }

    @Get('/info')
    @UseGuards(JwtAuthGuard)
    getAllInfo(@Query() query: PaginationParams) {
        return this.userService.getAllInfo(query)
    }


    @Get(':id')
    @UseGuards(JwtAuthGuard)
    getById(@Param() params: SearchParams) {
        return this.userService.getById(params.id)
    }

    @Get('/info/:id')
    @UseGuards(JwtAuthGuard)
    getByIdInfo(@Param() params: SearchParams) {
        return this.userService.getByIdInfo(params.id)
    }

    @Get('/by-username/:username')
    @UseGuards(JwtAuthGuard)
    getManyByUsername(@Param('username') username: string, @Query() query: PaginationParams) {
        return this.userService.getManyByUsername(username, query)
    }

    @Get("/subscriptions/:id")
    getSubscriptions(@Param() params: SearchParams, @Query() query: PaginationParams) {
        return this.userService.getSubscriptions(params.id, query)
    }

    @Get("/followers/:id")
    getFollowers(@Param() params: SearchParams, @Query() query: PaginationParams) {
        return this.userService.getFollowers(params.id, query)
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

    @Post('/give-role/:id')
    // @Roles('admin')
    // @UseGuards(RolesGuard)
    giveRole(@Param() params:  SearchParams, @Body('roleValue') roleValue: RoleType) {
        return this.userService.giveRole(params.id, roleValue)
    }



}
