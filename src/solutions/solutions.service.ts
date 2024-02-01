import { CreateFeedbackDto } from './../feedbacks/dto/create-feedback.dto';
import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class SolutionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    private readonly feddbacksService: FeedbacksService,
  ) { }

  async create(dto: CreateSolutionDto) {
    const data: Solution = await this.prismaService.solution.create({
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
    return { data };
  }

  async findApproved() {
    const solutions = await this.prismaService.solution.findMany({
      include: {
        thematic: true,
        status: true,
      },
    });
    const data = solutions.filter((solution) => solution.status.id > 1);
    return { data };
  }

  async findAll() {
    const data: Solution[] = await this.prismaService.solution.findMany({
      include: {
        thematic: true,
        status: true,
        images: true,
      },
    });
    return { data };
  }

  async findOne(id: number) {
    const data = await this.prismaService.solution.findUnique({
      where: { id },
      include: {
        thematic: true,
        user: true,
        status: true,
        images: true,
        feedbacks: true,
        challenges: true
      },
    });
    if (!data) throw new NotFoundException('La solution n\'a pas été trouvé');
    return { data };
  }

  async findbyUser(email: string) {
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
  }

  async findByCall(callId: number) {
    const data = await this.prismaService.solution.findMany({
      where: { callId },
      include: { thematic: true },
    });
    return { data };
  }

  async updateUserSolution(id: number, dto: UpdateUserSolutionDto) {
    await this.findOne(id)
    const data = await this.prismaService.solution.update({
      where: { id },
      data: {
        ...dto,
      },
    });
    return { data };
  }

  async update(id: number, dto: UpdateSolutionDto) {
    const { data: solution } = await this.findOne(id)
    const data = await this.prismaService.solution.update({
      where: { id },
      data: {
        ...dto,
        pole: {
          connect: {
            id: dto.pole || solution.poleId
          }
        },
        thematic: {
          connect: {
            id: dto.thematic || solution.thematicId,
          },
        },
        user: {
          connect: {
            email: dto.user || solution.user.email,
          },
        },
        call: {
          connect: {
            id: dto.call || solution.callId,
          },
        },
        status: {
          connect: {
            id: dto.status || solution.statusId,
          },
        },
        challenges: {
          connect: dto?.challenges?.map((id: number) => ({ id })) || solution.challenges,
        },
      },
    });
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.solution.delete({
      where: { id },
    });
  }

  async uploadImages(id: number, images: Express.Multer.File[]) {
    await this.prismaService.solution.update({
      where: { id },
      data: {
        images: {
          create: images.map((image) => ({ imageLink: image.filename })),
        },
      },
    });
  }

  async deleteImage(id: number): Promise<any> {
    const image = await this.prismaService.solutionImages.findUnique({
      where: { id },
    });
    if (!image) throw new NotFoundException('L\'image n\'a pas été trouvée');
    await unlinkAsync(`./uploads/${image.imageLink}`);
    await this.prismaService.solutionImages.delete({
      where: { id },
    });
  }

  async sendComment(user: User, comment: string) {
    let from = `Support fikiri <${this.configService.get('MAIL_USERNAME')}>`;
    await this.mailService.sendMail({
      to: user.email,
      from,
      subject: 'Objet : Commentaire sur votre solution soumise sur fikiri',
      text: `
Bonjour ${user.name},

${comment}

L'équipe Fikiri,
Cordialement.
      `,
    });
  }

  async addFeedback(id: number, dto: CreateFeedbackDto) {
    const { data: solution } = await this.findOne(id);
    const { data } = await this.feddbacksService.create(dto);
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
    if (dto.userComment) await this.sendComment(solution.user, data.userComment);
    return { data };
  }

  async updateFeedback(id: number, dto: UpdateFeedbackDto) {
    await this.feddbacksService.findOne(id);
    const { data } = await this.feddbacksService.update(id, dto);
    return { data };
  }

  async deleteFeedback(id: number) {
    await this.feddbacksService.findOne(id);
    await this.feddbacksService.remove(id);
  }

  async solutionsByPole(pole: number) {
    const data = await this.prismaService.solution.findMany({
      where: { poleId: pole },
      include: {
        thematic: true,
        status: true,
      }
    });
    return { data };
  }
}
