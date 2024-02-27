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
import { Solution, User } from '@prisma/client';
import { UpdateFeedbackDto } from 'src/feedbacks/dto/update-feedback.dto';
import { CreateFeedbackDto } from '../feedbacks/dto/create-feedback.dto';
import { paginate } from 'src/helpers/paginate';

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

  async findMapped(page: number) {
    const solutions = await this.getSolutions(page);
    const data = solutions.filter(
      (solution) => solution.status.id > 1 && solution.status.id < 5,
    );
    return { data };
  }

  async getSolutions(page: number) {
    const { offset, limit } = paginate(page, 30);
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
        status: true,
        user: true,
        images: true,
        feedbacks: {
          include: {
            quotations: true,
          },
        },
      },
    });
  }

  async findConforms(page: number) {
    const solutions = await this.getSolutions(page);
    const data = solutions.filter(
      (solution) =>
        solution.videoLink || solution.images.length > 0 || solution.imageLink,
    );
    return { data };
  }

  async findCurated(page: number) {
    const solutions = await this.getSolutions(page);
    const data = solutions.filter((solution) => solution.feedbacks.length > 0);
    return { data };
  }

  async findNonConforms(page: number) {
    const solutions = await this.getSolutions(page);
    const data = solutions.filter(
      (solution) =>
        !solution.videoLink &&
        !(solution.images.length > 0 || solution.imageLink),
    );
    return { data };
  }

  async findAll(page: number) {
    const data = await this.getSolutions(page);
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
              quotations: true,
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
