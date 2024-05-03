import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Score } from './entities/score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Score])],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
  exports: [FeedbacksService]
})
export class FeedbacksModule {}
