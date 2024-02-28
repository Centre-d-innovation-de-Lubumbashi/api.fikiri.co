import { Controller, Delete, Get, Param } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Get()
  findAll() {
    return this.feedbacksService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(+id);
  }
}
