import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CallsService } from './calls.service';
import { Prisma } from '@prisma/client';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) { }  

  @Post()
  create(@Body() createCallsDto: Prisma.CallCreateInput) {
    return this.callsService.create(createCallsDto);
  }

  @Get()
  findAll() {
    return this.callsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallsDto: Prisma.CallUpdateInput) {
    return this.callsService.update(+id, updateCallsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.callsService.remove(+id);
  }
}
