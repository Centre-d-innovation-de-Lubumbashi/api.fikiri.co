import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as fs from 'fs';
import { promisify } from 'util';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { FeedbacksService } from 'src/feedbacks/feedbacks.service';
import { User } from '@prisma/client';
import { UpdateFeedbackDto } from 'src/feedbacks/dto/update-feedback.dto';
import { CreateFeedbackDto } from '../feedbacks/dto/create-feedback.dto';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class SolutionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    private readonly feedbacksService: FeedbacksService,
  ) {}

  async create(dto: CreateSolutionDto) {
    try {
      await this.prismaService.solution.create({
        data: {
          ...dto,
          thematic: {
            connect: {
              id: dto.thematic,
            },
          },
          user: {
            connect: {
              email: dto.user,
            },
          },
          call: {
            connect: {
              id: dto.call,
            },
          },
          status: {
            connect: {
              id: 1,
            },
          },
          challenges: {
            connect: dto.challenges.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException(
        'Erreur lors de la création de la solution',
      );
    }
  }

  async findMapped() {
    const solutions = await this.getSolutions();
    const data = solutions.filter((solution) => solution.status.id > 1);
    return { data };
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async getPaginatedData(page: number) {
    // await this.sleep(1000);
    if (isNaN(page) || page < 0) page = 1;
    const take = page * 12;
    const data = await this.prismaService.solution.findMany({
      take,
      select: {
        id: true,
        name: true,
        userId: true,
        description: true,
        videoLink: true,
        imageLink: true,
        thematic: true,
        challenges: true,
        status: true,
        user: true,
        images: true,
        feedbacks: true,
      },
      // Add other conditions or sorting if needed
    });
    return { data };
  }

  async getSolutions() {
    return await this.prismaService.solution.findMany({
      // skip: offset,
      // take: limit,
      select: {
        id: true,
        name: true,
        userId: true,
        description: true,
        videoLink: true,
        imageLink: true,
        thematic: true,
        challenges: true,
        status: true,
        user: true,
        images: true,
        feedbacks: true,
      },
    });
  }

  async findConforms(page: number) {
    const solutions = await this.getSolutions();
    const data = solutions.filter(
      (solution) =>
        solution.videoLink || solution.images.length > 0 || solution.imageLink,
    );
    return { data };
  }

  async findCurated(page: number) {
    const solutions = await this.getSolutions();
    const data = solutions.filter((solution) => solution.feedbacks.length > 0);
    return { data };
  }

  async findNonConforms(page: number) {
    const solutions = await this.getSolutions();
    const data = solutions.filter(
      (solution) =>
        !solution.videoLink &&
        !(solution.images.length > 0 || solution.imageLink),
    );
    return { data };
  }

  async findAll(page: number) {
    const data = await this.getSolutions();

    const conforms = data.filter(
      (solution) =>
        solution.videoLink || solution.images.length > 0 || solution.imageLink,
    );

    const average = Math.ceil(data.length / 3); // Update the division by 3 since there are 3 poles.
    for (let i = 0; i < 3; i++) {
      const poleId = [1, 3, 4][i]; // Update the poleId according to the array [1, 3, 4].
      const poleSolutions = data.slice(
        i * average,
        Math.min((i + 1) * average, data.length),
      );

      for (const solution of poleSolutions) {
        await this.prismaService.solution.update({
          where: { id: solution.id },
          data: {
            pole: {
              connect: {
                id: conforms.includes(solution) ? poleId : null,
              },
            },
          },
        });
      }
    }

    return { data };
  }

  async findOne(id: number) {
    try {
      const data = await this.prismaService.solution.findUnique({
        where: { id },
        include: {
          thematic: true,
          user: true,
          status: true,
          images: true,
          feedbacks: {
            include: {
              user: true,
            },
          },
          challenges: true,
          pole: true,
        },
      });
      if (!data) throw new NotFoundException("La solution n'a pas été trouvé");
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération de la solution',
      );
    }
  }

  async findbyUser(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (user) {
        const data = await this.prismaService.solution.findMany({
          where: { userId: user.id },
          include: {
            status: true,
            images: true,
          },
        });
        return { data };
      }
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération de la solution',
      );
    }
  }

  async findMappedByCall(callId: number) {
    const solutions = await this.prismaService.solution.findMany({
      where: { callId },
      include: {
        thematic: true,
        status: true,
        user: true,
      },
    });
    const data = solutions.filter(
      (solution) => solution.status.id > 1 && solution.status.id < 5,
    );
    return { data };
  }

  async findByCall(callId: number) {
    try {
      const data = await this.prismaService.solution.findMany({
        where: { callId },
        include: { thematic: true },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération des solutions',
      );
    }
  }

  async updateUserSolution(id: number, dto: UpdateUserSolutionDto) {
    try {
      await this.findOne(id);
      const data = await this.prismaService.solution.update({
        where: { id },
        data: {
          ...dto,
        },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la solution',
      );
    }
  }

  async update(id: number, dto: UpdateSolutionDto) {
    try {
      const { data: solution } = await this.findOne(id);
      const data = await this.prismaService.solution.update({
        where: { id },
        data: {
          ...dto,
          pole: {
            connect: {
              id: dto.pole ?? solution.poleId,
            },
          },
          thematic: {
            connect: {
              id: dto.thematic ?? solution.thematicId,
            },
          },
          user: {
            connect: {
              email: dto.user ?? solution.user.email,
            },
          },
          call: {
            connect: {
              id: dto.call ?? solution.callId,
            },
          },
          status: {
            connect: {
              id: dto.status ?? solution.statusId,
            },
          },
          challenges: {
            set:
              dto?.challenges?.map((id: number) => ({ id })) ??
              solution.challenges,
          },
        },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la solution',
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.solution.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException(
        'Erreur lors de la suppression de la solution',
      );
    }
  }

  async uploadImages(id: number, images: Express.Multer.File[]) {
    try {
      await this.prismaService.solution.update({
        where: { id },
        data: {
          images: {
            create: images.map((image) => ({ imageLink: image.filename })),
          },
        },
      });
    } catch {
      throw new BadRequestException(
        "Erreur lors de l'ajout des images à la solution",
      );
    }
  }

  async deleteImage(id: number): Promise<any> {
    try {
      const image = await this.prismaService.solutionImages.findUnique({
        where: { id },
      });
      if (!image) throw new NotFoundException("L'image n'a pas été trouvée");
      await unlinkAsync(`./uploads/${image.imageLink}`);
      await this.prismaService.solutionImages.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException("Erreur lors de la suppression de l'image");
    }
  }

  async sendComment(user: User, comment: string) {
    let from = `Support fikiri <${this.configService.get('MAIL_USERNAME')}>`;
    try {
      await this.mailService.sendMail({
        to: user.email,
        from,
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
      const { data: solution } = await this.findOne(id);
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
      const { data: solution } = await this.findOne(id);

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

  async solutionsByPole(poleId: number) {
    try {
      const data = await this.prismaService.solution.findMany({
        where: { poleId },
        select: {
          id: true,
          name: true,
          user: true,
          userId: true,
          description: true,
          videoLink: true,
          imageLink: true,
          thematic: true,
          status: true,
          images: true,
          feedbacks: true,
        },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération des solutions par pôle',
      );
    }
  }
}
