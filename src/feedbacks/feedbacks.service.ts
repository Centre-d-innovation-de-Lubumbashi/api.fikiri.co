import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class FeedbacksService {
  constructor(
    private readonly prismaService: PrismaService
  ) { }

  async create(dto: CreateFeedbackDto) {
    const data: Feedback = await this.prismaService.feedback.create({
      data: {
        ...dto,
        user: {
          connect: {
            email: dto.user
          }
        },
        quotations: {
          connect: dto.quotations.map(id => ({ id }))
        }
      }
    })
    return { data };
  }

  async findAll() {
    const data = await this.prismaService.feedback.findMany()
    return { data };
  }

  async findOne(id: number) {
    const data = await this.prismaService.feedback.findUnique({
      where: { id },
      include: {
        user: true,
        quotations: true
      }
    })
    if (!data) throw new NotFoundException(`Ce feedback n'existe pas`);
    return { data };
  }

  async update(id: number, dto: UpdateFeedbackDto) {
    const { data: feedback } = await this.findOne(id);
    const data = await this.prismaService.feedback.update({
      where: { id },
      data: {
        ...dto,
        user: {
          connect: {
            email: dto.user || feedback.user.email
          }
        },
        quotations: {
          set: dto?.quotations?.map(id => ({ id })) || feedback.quotations
        }
      }
    })
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.feedback.delete({
      where: { id }
    })
  }
}
