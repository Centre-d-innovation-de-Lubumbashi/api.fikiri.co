import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PolesService } from './poles.service';
import { CreatePoleDto } from './dto/create-pole.dto';
import { UpdatePoleDto } from './dto/update-pole.dto';

@Controller('poles')
export class PolesController {
  constructor(private readonly polesService: PolesService) {}

  @Post()
  create(@Body() createPoleDto: CreatePoleDto) {
    return this.polesService.create(createPoleDto);
  }

  @Get()
  findAll() {
    return this.polesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.polesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePoleDto: UpdatePoleDto) {
    return this.polesService.update(+id, updatePoleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.polesService.remove(+id);
  }
}
