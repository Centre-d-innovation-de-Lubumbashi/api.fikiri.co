import { Module } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { SolutionsController } from './solutions.controller';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';
import { SolutionsFeedbacksService } from './solutions-feebacks.service';
import { SolutionsFeedbacksController } from './solutions-feebacks.controller';
import { SolutionsFiltersController } from './solutions-filters.controller';
import { SolutionsFiltersService } from './solutions-filters.service';

@Module({
  imports: [FeedbacksModule],
  controllers: [
    SolutionsController,
    SolutionsFeedbacksController,
    SolutionsFiltersController,
  ],
  providers: [
    SolutionsService,
    SolutionsFeedbacksService,
    SolutionsFiltersService,
  ],
})
export class SolutionsModule {}
