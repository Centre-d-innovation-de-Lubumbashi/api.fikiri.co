import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFeedbackDto } from 'src/feedbacks/dto/create-feedback.dto';
import { UpdateFeedbackDto } from 'src/feedbacks/dto/update-feedback.dto';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';

@Injectable()
export class SolutionsFeedbacksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly feedbacksService: FeedbacksService,
    private readonly mailService: MailerService,
  ) {}

  async sendComment(user: User, comment: string) {
    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Commentaire sur votre solution soumise sur fikiri',
        text: `
Bonjour ${user.name},

${comment}

L'équipe Fikiri,
Cordialement.
      `,
      });
    } catch {
      throw new BadRequestException("Erreur lors de l'envoi du commentaire");
    }
  }

  async addFeedback(id: number, dto: CreateFeedbackDto) {
    try {
      const solution = await this.prismaService.solution.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
      const { data } = await this.feedbacksService.create(dto);
      await this.prismaService.solution.update({
        where: { id },
        data: {
          feedbacks: {
            connect: {
              id: data.id,
            },
          },
        },
      });
      if (dto?.userComment)
        await this.sendComment(solution.user, data.userComment);
      return { data };
    } catch {
      throw new BadRequestException(
        "Erreur lors de l'ajout du feedback à la solution",
      );
    }
  }

  async updateFeedback(id: number, dto: UpdateFeedbackDto) {
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

  async deleteFeedback(id: number) {
    try {
      await this.feedbacksService.findOne(id);
      await this.feedbacksService.remove(id);
    } catch {
      throw new BadRequestException(
        'Erreur lors de la suppression du feedback à la solution',
      );
    }
  }

  async findFeedbacksQuotations(id: number) {
    try {
      const solution = await this.prismaService.solution.findUnique({
        where: { id },
        include: {
          feedbacks: true,
        },
      });
      const quotations = solution.feedbacks.map((feedback) =>
        feedback.quotations.split(',').map((quotation) => parseInt(quotation)),
      );
      const data = await Promise.all(
        quotations.map(async (quotation) => {
          const promises = quotation.map(async (id) => {
            const data = await this.prismaService.quotation.findUnique({
              where: { id },
              select: {
                id: true,
                mention: true,
                average: true,
              },
            });
            return data;
          });
          return await Promise.all(promises);
        }),
      );

      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération des citations du feedback',
      );
    }
  }
}
