import { Call } from '@prisma/client';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CallsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCallDto) {
    try {
      await this.prisma.call.create({
        data: dto,
      });
    } catch {
      throw new BadRequestException("Impossible de créer l'appel à solution");
    }
  }

  async findAll() {
    const data: Call[] = await this.prisma.call.findMany({});
    return { data };
  }

  async findOne(id: number) {
    try {
      const data = await this.prisma.call.findUnique({
        where: { id },
        include: { thematics: true },
      });
      if (!data) throw new NotFoundException("L'appel à solution introuvable");
      return { data };
    } catch {
      throw new NotFoundException("Impossible de supprimer l'appel à solution");
    }
  }

  async update(id: number, dto: UpdateCallDto) {
    try {
      await this.findOne(id);
      const data: Call | null = await this.prisma.call.update({
        data: dto,
        where: { id },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        "Impossible de mettre à jour l'appel à solution",
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.call.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException(
        "Impossible de supprimer l'appel à solution",
      );
    }
  }
}
