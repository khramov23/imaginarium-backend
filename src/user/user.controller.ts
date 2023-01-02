import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {UserService} from "./user.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {Types} from "mongoose";
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get()
    getAll() {
        return this.userService.getAll()
    }

    @Get(':id')
    getById(@Param('id') id: Types.ObjectId) {
        return this.userService.getById(id)
    }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.userService.create(dto)
    }

    @Delete(':id')
    delete(@Param('id') id: Types.ObjectId) {
        return this.userService.delete(id)
    }

    @Patch(':id')
    update(@Param('id') id: Types.ObjectId, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto)
    }

}
