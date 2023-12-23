import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThematicsService } from './thematics.service';
import { Prisma } from '@prisma/client';

@Controller('thematics')
export class ThematicsController {
  constructor(private readonly thematicsService: ThematicsService) { }

  @Post()
  create(@Body() createThematicDto: Prisma.ThematicCreateInput) {
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
  update(@Param('id') id: string, @Body() updateThematicDto: Prisma.ThematicUpdateInput) {
    return this.thematicsService.update(+id, updateThematicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thematicsService.remove(+id);
  }
}
