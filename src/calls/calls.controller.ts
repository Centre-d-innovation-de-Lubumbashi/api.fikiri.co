import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  create(@Body() createCallsDto: CreateCallDto) {
    return this.callsService.create(createCallsDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.callsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCallsDto: UpdateCallDto) {
    return this.callsService.update(+id, updateCallsDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.callsService.remove(+id);
  }
}
