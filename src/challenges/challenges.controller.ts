import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly ChallengesService: ChallengesService) {}

  @Get()
  findAll() {
    return this.ChallengesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ChallengesService.findOne(+id);
  }

  @Get('thematic/:id')
  findByThematic(@Param('id') id: string) {
    return this.ChallengesService.findByThematic(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChallengeDto: UpdateChallengeDto,
  ) {
    return this.ChallengesService.update(+id, updateChallengeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ChallengesService.remove(+id);
  }
}
