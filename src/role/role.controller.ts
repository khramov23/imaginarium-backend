import {Body, Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {RoleService} from "./role.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {SearchParams} from "../validators/param.validator";
import {Roles} from "../auth/decorators/roles.decorator";
import {RolesGuard} from "../auth/guards/roles.guard";

@Controller('roles')
export class RoleController {

    constructor(private readonly roleService: RoleService) {}

    @Get()
    @Roles('admin')
    @UseGuards(RolesGuard)
    getAll() {
        return this.roleService.getAll()
    }

    @Post()
    @Roles('admin')
    @UseGuards(RolesGuard)
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.create(dto)
    }

    @Delete(':id')
    @Roles('admin')
    @UseGuards(RolesGuard)
    delete(@Param() params: SearchParams) {
        return this.roleService.delete(params.id)
    }
}
