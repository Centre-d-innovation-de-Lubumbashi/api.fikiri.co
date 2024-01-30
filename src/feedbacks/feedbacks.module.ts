import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';

@Module({
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
  exports: [FeedbacksService]
})
export class FeedbacksModule { }
