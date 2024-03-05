import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateStatusDto } from './dto/create-status.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';

@Controller('status')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Post()
  @Roles(RoleEnum.Admin)
  create(@Body() dto: CreateStatusDto) {
    return this.statusService.create(dto);
  }

  @Get()
  findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.statusService.update(+id, dto);
  }

  @Delete('id')
  @Roles(RoleEnum.Admin)
  delete(@Param('id') id: string) {
    return this.statusService.delete(+id);
  }
}
