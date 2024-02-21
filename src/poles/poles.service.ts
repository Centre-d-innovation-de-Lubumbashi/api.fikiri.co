import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePoleDto } from './dto/create-pole.dto';
import { UpdatePoleDto } from './dto/update-pole.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Pole } from '@prisma/client';

@Injectable()
export class PolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePoleDto) {
    try {
      const pole = await this.prisma.pole.findFirst({
        where: { name: dto.name },
      });
      if (pole) throw new ConflictException('Ce pôle existe déjà');
      await this.prisma.pole.create({
        data: dto,
      });
    } catch {
      throw new BadRequestException('Impossible de créer le pôle');
    }
  }

  async findAll() {
    const data = await this.prisma.pole.findMany();
    return { data };
  }

  async findOne(id: number) {
    try {
      const data: Pole | null = await this.prisma.pole.findFirst({
        where: { id },
      });
      if (!data) throw new NotFoundException("Ce pôle n'existe pas");
      return { data };
    } catch {
      throw new BadRequestException('Impossible de récupérer le pôle');
    }
  }

  async update(id: number, dto: UpdatePoleDto) {
    try {
      await this.findOne(id);
      const data: Pole | null = await this.prisma.pole.update({
        where: { id },
        data: dto,
      });
      return { data };
    } catch {
      throw new BadRequestException('Impossible de mettre à jour le pôle');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.pole.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException('Impossible de supprimer le pôle');
    }
  }
}
