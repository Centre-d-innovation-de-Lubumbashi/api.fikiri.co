import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { StatusService } from './status.service';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('status')
export class StatusController {
  constructor(
    private statusService: StatusService,
  ) {
  }

  @Get()
  findAll() {
    return this.statusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateStatusDto) {
    return this.statusService.update(+id, data);
  }

  @Delete('id')
  delete(@Param('id') id: string) {
    return this.statusService.delete(+id);
  }
}
