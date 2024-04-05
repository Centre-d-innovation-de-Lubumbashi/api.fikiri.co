import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SolutionsFeedbacksService } from './solutions-feebacks.service';
import { CreateFeedbackDto } from 'src/feedbacks/dto/create-feedback.dto';
import { UpdateFeedbackDto } from 'src/feedbacks/dto/update-feedback.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { Solution } from './entities/solution.entity';
import { Quotation } from '../quotations/entities/quotation.entity';

@Controller('solutions')
export class SolutionsFeedbacksController {
  constructor(
    private readonly solutionsFeedbacksService: SolutionsFeedbacksService,
  ) {
  }

  @Post('feedback/:id')
  @Roles(RoleEnum.Admin, RoleEnum.Curator)
  addFeedback(@Param('id') id: string, @Body() dto: CreateFeedbackDto): Promise<{ data: Solution }> {
    return this.solutionsFeedbacksService.addFeedback(+id, dto);
  }

  @Patch('feedback/:id')
  updateFeedback(@Param('id') id: string, @Body() dto: UpdateFeedbackDto): Promise<{ data: Feedback }> {
    return this.solutionsFeedbacksService.updateFeedback(+id, dto);
  }

  @Delete('feedback/:id')
  @Roles(RoleEnum.Admin)
  deleteFeedback(@Param('id') id: string): Promise<void> {
    return this.solutionsFeedbacksService.deleteFeedback(+id);
  }

  @Get('feedbacks/quotations/:id')
  findFeedbacksQuotations(@Param('id') id: string): Promise<{ data: Quotation }[]> {
    return this.solutionsFeedbacksService.findFeedbacksQuotations(+id);
  }
}
