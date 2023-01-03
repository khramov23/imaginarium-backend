import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {Roles} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";
import {SearchParams} from "../validators/param.validator";

@Controller('users')
@UsePipes(ValidationPipe)
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Roles('admin', 'manager')
    @UseGuards(RolesGuard)
    @Get()
    getAll() {
        return this.userService.getAll()
    }

    @Get(':id')
    getById(@Param() params: SearchParams) {
        return this.userService.getById(params.id)
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto)
    }

    @Delete(':id')
    delete(@Param() params: SearchParams) {
        return this.userService.delete(params.id)
    }

    @Patch(':id')
    update(@Param() params: SearchParams, @Body() dto: UpdateUserDto) {
        return this.userService.update(params.id, dto)
    }

}
