import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { CreateLableDto } from './dto/create-lable.dto';
import { UpdateLableDto } from './dto/update-lable.dto';

@Controller('labels')
export class LabelsController {
  constructor(private readonly lablesService: LabelsService) { }

  @Post()
  create(@Body() createLableDto: CreateLableDto) {
    return this.lablesService.create(createLableDto);
  }

  @Get()
  findAll() {
    return this.lablesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lablesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLableDto: UpdateLableDto) {
    return this.lablesService.update(+id, updateLableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lablesService.remove(+id);
  }
}
