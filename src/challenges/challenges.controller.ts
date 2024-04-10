import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Challenge } from './entities/challenge.entity';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly ChallengesService: ChallengesService) {
  }

  @Post()
  @Roles([RoleEnum.Admin])
  create(@Body() createChallengeDto: CreateChallengeDto): Promise<{ data: Challenge }> {
    return this.ChallengesService.create(createChallengeDto);
  }

  @Public()
  @Get()
  findAll(): Promise<{ data: Challenge[] }> {
    return this.ChallengesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<{ data: Challenge }> {
    return this.ChallengesService.findOne(+id);
  }

  @Get('thematic/:id')
  findByThematic(@Param('id') id: string): Promise<{ data: Challenge[] }> {
    return this.ChallengesService.findByThematic(+id);
  }

  @Patch(':id')
  @Roles([RoleEnum.Admin])
  update(@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto): Promise<{ data: Challenge }> {
    return this.ChallengesService.update(+id, updateChallengeDto);
  }

  @Delete(':id')
  @Roles([RoleEnum.Admin])
  remove(@Param('id') id: string): Promise<void> {
    return this.ChallengesService.remove(+id);
  }
}
