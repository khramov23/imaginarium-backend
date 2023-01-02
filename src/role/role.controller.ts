import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {RoleService} from "./role.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {Types} from "mongoose";

@Controller('roles')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}

    @Get()
    getAll() {
        return this.roleService.getAll()
    }

    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.create(dto)
    }

    @Delete(':id')
    delete(@Param('id') id: Types.ObjectId) {
        return this.roleService.delete(id)
    }
}
