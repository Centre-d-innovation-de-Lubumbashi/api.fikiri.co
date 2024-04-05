import { Module } from '@nestjs/common';
import { SolutionsService } from './solutions.service';
import { SolutionsController } from './solutions.controller';
import { FeedbacksModule } from 'src/feedbacks/feedbacks.module';
import { QuotationsModule } from '../quotations/quotations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solution } from './entities/solution.entity';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [FeedbacksModule, QuotationsModule, ImagesModule, TypeOrmModule.forFeature([Solution])],
  controllers: [SolutionsController],
  providers: [SolutionsService],
})
export class SolutionsModule {
}
