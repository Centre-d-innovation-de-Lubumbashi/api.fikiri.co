import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from 'src/feedbacks/dto/create-feedback.dto';
import { UpdateFeedbackDto } from 'src/feedbacks/dto/update-feedback.dto';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';
import { Repository } from 'typeorm';
import { Solution } from './entities/solution.entity';
import { QuotationsService } from '../quotations/quotations.service';
import { Feedback } from '../feedbacks/entities/feedback.entity';
import { Quotation } from '../quotations/entities/quotation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SolutionsFeedbacksService {
  constructor(
    @InjectRepository(Solution)
    private readonly solutionRepository: Repository<Solution>,
    private readonly feedbacksService: FeedbacksService,
    private readonly quotationsService: QuotationsService,
  ) {
  }

  async addFeedback(id: number, dto: CreateFeedbackDto): Promise<{ data: Solution }> {
    try {
      const solution: Solution = await this.solutionRepository.findOneOrFail({
        where: { id },
        relations: ['user'],
      });
      const { data: feedBack } = await this.feedbacksService.create(dto);
      solution.feedbacks = [...solution.feedbacks, feedBack];
      const data: Solution = await this.solutionRepository.save(solution);
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de l\'ajout du feedback à la solution');
    }
  }

  async updateFeedback(id: number, dto: UpdateFeedbackDto): Promise<{ data: Feedback }> {
    try {
      await this.feedbacksService.findOne(id);
      const { data } = await this.feedbacksService.update(id, dto);
      return { data };
    } catch {
      await this.feedbacksService.findOne(id);
      const { data } = await this.feedbacksService.update(id, dto);
      return { data };
    }
  }

  async deleteFeedback(id: number): Promise<void> {
    try {
      await this.feedbacksService.findOne(id);
      await this.feedbacksService.remove(id);
    } catch {
      throw new BadRequestException(
        'Erreur lors de la suppression du feedback à la solution',
      );
    }
  }

  async findFeedbacksQuotations(id: number): Promise<{ data: Quotation }[]> {
    try {
      const solution: Solution = await this.solutionRepository.findOne({
        where: { id },
        relations: ['feedbacks'],
      });
      const feedbackQuotations: number[] = solution.feedbacks.flatMap(feedback => feedback.quotations.split(',').map(Number));
      const quotationPromises = feedbackQuotations.map(quotationId => this.quotationsService.findOne(quotationId));
      return await Promise.all(quotationPromises);
    } catch {
      throw new BadRequestException('Error fetching feedback quotations.');
    }
  }

}
