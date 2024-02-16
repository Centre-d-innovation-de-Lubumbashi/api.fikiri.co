import { PrismaService } from '../database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from '@prisma/client';

@Injectable()
export class ChallengesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateChallengeDto) {
    const data: Challenge = await this.prismaService.challenge.create({
      data: {
        ...dto,
        thematics: {
          connect: dto.thematics.map((id) => ({ id })),
        },
      },
    });
    return { data };
  }

  async findAll() {
    const thematics = await this.prismaService.challenge.findMany();
    return {
      data: thematics,
    };
  }

  async findByThematic(thematicId: number) {
    const data = await this.prismaService.challenge.findMany({
      where: { thematics: { some: { id: thematicId } } },
    });
    return { data };
  }

  async findOne(id: number) {
    const data = await this.prismaService.challenge.findUnique({
      where: { id },
      include: {
        thematics: true,
      },
    });
    if (!data) throw new NotFoundException("Le défi n'a pas été trouvé");
    return { data };
  }

  async update(id: number, dto: UpdateChallengeDto) {
    const { data: challenge } = await this.findOne(id);
    const data = await this.prismaService.challenge.update({
      where: { id },
      data: {
        ...dto,
        thematics: {
          connect: dto?.thematics?.map((id) => ({ id })) || challenge.thematics,
        },
      },
    });
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.challenge.delete({
      where: { id },
    });
  }
}
