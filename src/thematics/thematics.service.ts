import { PrismaService } from '../database/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateThematicDto } from './dto/create-thematic.dto';
import { UpdateThematicDto } from './dto/update-thematic.dto';
import { Thematic } from '@prisma/client';

@Injectable()
export class ThematicsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateThematicDto) {
    try {
      await this.prismaService.thematic.create({
        data: {
          ...dto,
          calls: {
            connect: {
              id: dto.call,
            },
          },
        },
      });
    } catch {
      throw new NotFoundException(
        'Erreur lors de la création de la thématique',
      );
    }
  }

  async findAll() {
    const data: Thematic[] = await this.prismaService.thematic.findMany();
    return { data };
  }

  async findOne(id: number) {
    try {
      const data: Thematic = await this.prismaService.thematic.findUnique({
        where: { id },
        include: {
          challenges: true,
        },
      });
      if (!data)
        throw new NotFoundException("La thématique n'a pas été trouvé");
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération de la thématique',
      );
    }
  }

  async findByCall(callId: number) {
    try {
      const data: Thematic[] = await this.prismaService.thematic.findMany({
        where: { calls: { some: { id: callId } } },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération de la thématique',
      );
    }
  }

  async update(id: number, dto: UpdateThematicDto) {
    try {
      await this.findOne(id);
      const data: Thematic = await this.prismaService.thematic.update({
        data: dto,
        where: { id },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la modification de la thématique',
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.thematic.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException(
        'Erreur lors de la suppression de la thématique',
      );
    }
  }
}
