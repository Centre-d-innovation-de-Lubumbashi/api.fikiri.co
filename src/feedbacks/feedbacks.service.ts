import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FeedbacksService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(dto: CreateFeedbackDto) {
    const data: Feedback = await this.prisma.feedback.create({
      data: {
        ...dto,
        user: {
          connect: {
            email: dto.user
          }
        },
        labels: {
          connect: {
            id: dto.label
          }
        }
      }
    })
    return { data };
  }

  async findAll() {
    const data = await this.prisma.feedback.findMany()
    return { data };
  }

  async findOne(id: number) {
    const data = await this.prisma.feedback.findUnique({
      where: { id }
    })
    if (!data) throw new NotFoundException(`Ce feedback n'existe pas`);
    return { data };
  }

  async update(id: number, dto: UpdateFeedbackDto) {
    await this.findOne(id);
    const data = await this.prisma.feedback.update({
      where: { id },
      data: {
        ...dto,
        user: {
          connect: {
            email: dto.user
          }
        },
        labels: {
          connect: {
            id: dto.label
          }
        }
      }
    })
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.feedback.delete({
      where: { id }
    })
  }
}
