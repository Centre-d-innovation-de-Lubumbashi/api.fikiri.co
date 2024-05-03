import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateCallDto } from './dto/update-event.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { Event } from './entities/event.entity';

@Controller('events')
export class EcentsController {
  constructor(private readonly callsService: EventsService) {}

  @Post('')
  @Roles([RoleEnum.Admin])
  create(@Body() createCallsDto: CreateEventDto): Promise<{ data: Event }> {
    return this.callsService.create(createCallsDto);
  }

  @Public()
  @Get('')
  findAll(): Promise<{ data: Event[] }> {
    return this.callsService.findAll();
  }

  @Public()
  @Get('recent')
  findRecent(): Promise<{ data: { call: Event; prev: number; next: number } }> {
    return this.callsService.findRecent();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ data: { call: Event; prev: number; next: number } }> {
    return this.callsService.findOne(+id);
  }

  @Patch(':id')
  @Roles([RoleEnum.Admin])
  update(@Param('id') id: string, @Body() updateCallsDto: UpdateCallDto): Promise<{ data: Event }> {
    return this.callsService.update(+id, updateCallsDto);
  }

  @Delete(':id')
  @Roles([RoleEnum.Admin])
  remove(@Param('id') id: string): Promise<void> {
    return this.callsService.remove(+id);
  }
}
