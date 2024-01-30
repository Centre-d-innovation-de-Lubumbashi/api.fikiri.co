import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';

@Module({
  providers: [FeedbacksService],
  exports: [FeedbacksService]
})
export class FeedbacksModule { }
