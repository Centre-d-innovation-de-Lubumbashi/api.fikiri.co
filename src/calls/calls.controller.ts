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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  @Roles(RoleEnum.Admin)
  create(@Body() createCallsDto: CreateCallDto) {
    return this.callsService.create(createCallsDto);
  }

  @Public()
  @Get('')
  findAll() {
    return this.callsService.findAll();
  }

  @Public()
  @Get('recent/one')
  findRecent() {
    return this.callsService.findRecent();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.callsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RoleEnum.Admin)
  update(@Param('id') id: string, @Body() updateCallsDto: UpdateCallDto) {
    return this.callsService.update(+id, updateCallsDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string) {
    return this.callsService.remove(+id);
  }
}
