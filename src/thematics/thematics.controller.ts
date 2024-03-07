import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ThematicsService } from './thematics.service';
import { CreateThematicDto } from './dto/create-thematic.dto';
import { UpdateThematicDto } from './dto/update-thematic.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('thematics')
export class ThematicsController {
  constructor(private readonly thematicsService: ThematicsService) {}

  @Post()
  @Roles(RoleEnum.Admin)
  create(@Body() createThematicDto: CreateThematicDto) {
    return this.thematicsService.create(createThematicDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.thematicsService.findAll();
  }

  @Get('call/:id')
  findByCall(@Param('id') id: string) {
    return this.thematicsService.findByCall(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thematicsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() data: UpdateThematicDto) {
    return this.thematicsService.update(+id, data);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string) {
    return this.thematicsService.remove(+id);
  }
}
