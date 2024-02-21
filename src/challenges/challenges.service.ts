import { PrismaService } from '../database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge } from '@prisma/client';

@Injectable()
export class ChallengesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateChallengeDto) {
    try {
      await this.prismaService.challenge.create({
        data: {
          ...dto,
          thematics: {
            connect: dto.thematics.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException('Impossible de créer le défi');
    }
  }

  async findAll() {
    const data: Challenge[] = await this.prismaService.challenge.findMany();
    return { data };
  }

  async findByThematic(thematicId: number) {
    try {
      const data = await this.prismaService.challenge.findMany({
        where: { thematics: { some: { id: thematicId } } },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Impossible de trouver les défis pour cette thématique',
      );
    }
  }

  async findOne(id: number) {
    try {
      const data = await this.prismaService.challenge.findUnique({
        where: { id },
        include: {
          thematics: true,
        },
      });
      if (!data) throw new NotFoundException("Le défi n'a pas été trouvé");
      return { data };
    } catch {
      throw new NotFoundException('Impossible de trouver le défi');
    }
  }

  async update(id: number, dto: UpdateChallengeDto) {
    try {
      const { data: challenge } = await this.findOne(id);
      const data = await this.prismaService.challenge.update({
        where: { id },
        data: {
          ...dto,
          thematics: {
            connect:
              dto?.thematics?.map((id) => ({ id })) || challenge.thematics,
          },
        },
      });
      return { data };
    } catch {
      throw new BadRequestException('Impossible de mettre à jour le défi');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.challenge.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException('Impossible de supprimer le défi');
    }
  }
}
