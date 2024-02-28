import { Module } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { SolutionsController } from './solutions.controller';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';

@Module({
  imports: [FeedbacksModule],
  controllers: [SolutionsController],
  providers: [SolutionsService],
})
export class SolutionsModule {}
