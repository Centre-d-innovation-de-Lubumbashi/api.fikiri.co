import { Module } from '@nestjs/common';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';
import { QuotationsModule } from '../quotations/quotations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesModule } from '../images/images.module';
import { SolutionsFeedbacksController } from './solution-feebacks.controller';
import { SolutionFeedbacksService } from './solution-feebacks.service';
import { Solution } from '../solutions/entities/solution.entity';

@Module({
  imports: [FeedbacksModule, QuotationsModule, ImagesModule, TypeOrmModule.forFeature([Solution])],
  controllers: [SolutionsFeedbacksController],
  providers: [SolutionFeedbacksService],
})
export class SolutionFeedbacksModule {
}
