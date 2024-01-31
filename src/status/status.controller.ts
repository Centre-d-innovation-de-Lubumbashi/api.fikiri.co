import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StatusService } from './status.service';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateStatusDto } from './dto/create-status.dto';

@Controller('status')
export class StatusController {
  constructor(
    private statusService: StatusService,
  ) { }

  @Post()
  create(@Body() dto: CreateStatusDto) {
    return this.statusService.create(dto)
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
  update(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.statusService.update(+id, dto);
  }

  @Delete('id')
  delete(@Param('id') id: string) {
    return this.statusService.delete(+id);
  }
}
