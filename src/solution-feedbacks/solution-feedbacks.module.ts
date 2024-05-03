import { Module } from '@nestjs/common';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';
import { SolutionsFeedbacksController } from './solution-feebacks.controller';
import { SolutionFeedbacksService } from './solution-feebacks.service';
import { SolutionsModule } from '../solutions/solutions.module';

@Module({
  imports: [FeedbacksModule, SolutionsModule],
  controllers: [SolutionsFeedbacksController],
  providers: [SolutionFeedbacksService]
})
export class SolutionFeedbacksModule {}
