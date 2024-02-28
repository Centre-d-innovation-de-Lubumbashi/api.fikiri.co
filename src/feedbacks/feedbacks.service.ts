import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FeedbacksService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateFeedbackDto) {
    try {
      const data: Feedback = await this.prismaService.feedback.create({
        data: {
          ...dto,
          quotations: dto.quotations.join(', '),
          user: {
            connect: {
              email: dto.user,
            },
          },
        },
      });
      return { data };
    } catch {
      throw new NotFoundException('Impossible de créer le feedback');
    }
  }

  async findAll() {
    const data = await this.prismaService.feedback.findMany({
      include: {
        user: true,
      },
    });
    return { data };
  }

  async findOne(id: number) {
    try {
      const data = await this.prismaService.feedback.findUnique({
        where: { id },
        include: {
          user: true,
        },
      });
      if (!data) throw new NotFoundException(`Ce feedback n'existe pas`);
      return { data };
    } catch {
      throw new NotFoundException('Impossible de récupérer le feedback');
    }
  }

  async update(id: number, dto: UpdateFeedbackDto) {
    try {
      const { data: feedback } = await this.findOne(id);
      const data = await this.prismaService.feedback.update({
        where: { id },
        data: {
          ...dto,
          quotations: dto.quotations.join(', '),
          user: {
            connect: {
              email: dto.user ?? feedback.user.email,
            },
          },
        },
      });
      return { data };
    } catch {
      throw new NotFoundException('Impossible de mettre à jour le feedback');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.feedback.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Impossible de supprimer le feedback');
    }
  }
}
