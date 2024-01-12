import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThematicsService } from './thematics.service';
import { CreateThematicDto } from './dto/create-thematic.dto';
import { UpdateThematicDto } from './dto/update-thematic.dto';

@Controller('thematics')
export class ThematicsController {
  constructor(private readonly thematicsService: ThematicsService) {
  }

  @Post()
  create(@Body() createThematicDto: CreateThematicDto) {
    return this.thematicsService.create(createThematicDto);
  }

  @Get()
  findAll() {
    return this.thematicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thematicsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateThematicDto) {
    return this.thematicsService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thematicsService.remove(+id);
  }
}
