import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { PolesService } from './poles.service';
import { CreatePoleDto } from './dto/create-pole.dto';
import { UpdatePoleDto } from './dto/update-pole.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { Pole } from './entities/pole.entity';

@Controller('poles')
export class PolesController {
  constructor(private readonly polesService: PolesService) {}

  @Post()
  @Roles([RoleEnum.Admin])
  create(@Body() createPoleDto: CreatePoleDto): Promise<{ data: Pole }> {
    return this.polesService.create(createPoleDto);
  }

  @Get()
  findAll(): Promise<{ data: Pole[] }> {
    return this.polesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ data: Pole }> {
    return this.polesService.findOne(+id);
  }

  @Patch(':id')
  @Roles([RoleEnum.Admin])
  update(@Param('id') id: string, @Body() updatePoleDto: UpdatePoleDto): Promise<{ data: Pole }> {
    return this.polesService.update(+id, updatePoleDto);
  }

  @Delete(':id')
  @Roles([RoleEnum.Admin])
  remove(@Param('id') id: string): Promise<void> {
    return this.polesService.remove(+id);
  }
}
