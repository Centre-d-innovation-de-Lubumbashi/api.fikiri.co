import { PrismaService } from '../database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  async create(data: CreateChallengeDto) {
    const challenge = await this.prismaService.challenge.create({
      data: {
        ...data,
        thematics: {
          connect: data.thematics.map((id) => ({ id })),
        },
      },
    });
    return {
      message: 'Le défi ajouté avec succès',
      data: challenge,
    };
  }

  async findAll() {
    const thematics = await this.prismaService.challenge.findMany();
    return {
      data: thematics,
    };
  }

  async findOne(id: number) {
    const challenge = await this.prismaService.challenge.findUnique({
      where: { id },
    });
    if (!challenge) throw new NotFoundException('Le défi n\'a pas été trouvé');
    return {
      data: challenge,
    };
  }

  async update(id: number, data: UpdateChallengeDto) {
    const challenge = await this.prismaService.challenge.findUnique({
      where: { id },
    });
    if (!challenge) throw new NotFoundException('Le défi est introuvable');
    const newChallenge = await this.prismaService.challenge.update({
      where: { id },
      data: {
        ...data,
        thematics: {
          connect: data.thematics.map((id) => ({ id })),
        },
      },
    });
    return {
      message: 'Le défi a été mis à jour avec succès',
      data: newChallenge,
    };
  }

  async remove(id: number) {
    await this.prismaService.challenge.delete({
      where: { id },
    });
    return {
      message: 'Le défi a été supprimé avec succès',
    };
  }

}
