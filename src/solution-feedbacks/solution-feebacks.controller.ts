import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { CreateFeedbackDto } from 'src/feedbacks/dto/create-feedback.dto';
import { UpdateFeedbackDto } from 'src/feedbacks/dto/update-feedback.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { SolutionFeedbacksService } from './solution-feebacks.service';
import { Solution } from '../solutions/entities/solution.entity';

@Controller('solution-feedbacks')
export class SolutionsFeedbacksController {
  constructor(private readonly solutionsFeedbacksService: SolutionFeedbacksService) {}

  @Post(':id')
  @Roles([RoleEnum.Admin, RoleEnum.Curator])
  addFeedback(@Param('id') id: string, @Body() dto: CreateFeedbackDto): Promise<{ data: Solution }> {
    return this.solutionsFeedbacksService.addFeedback(+id, dto);
  }

  @Patch(':id')
  updateFeedback(@Param('id') id: string, @Body() dto: UpdateFeedbackDto): Promise<{ data: Feedback }> {
    return this.solutionsFeedbacksService.updateFeedback(+id, dto);
  }

  @Delete(':id')
  @Roles([RoleEnum.Admin])
  deleteFeedback(@Param('id') id: string): Promise<void> {
    return this.solutionsFeedbacksService.deleteFeedback(+id);
  }
}
