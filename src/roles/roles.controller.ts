import { Body, Controller, Delete, Get, Param, Patch, Post, } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Prisma } from '@prisma/client';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {
    }

    @Post()
    create(@Body() createRoleDto: Prisma.RoleCreateInput) {
        return this.rolesService.create(createRoleDto);
    }

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateRoleDto: Prisma.RoleUpdateInput) {
        return this.rolesService.update(+id, updateRoleDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.rolesService.remove(+id);
    }
}
