import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLableDto } from './dto/create-quotation.dto';
import { UpdateLableDto } from './dto/update-quotation.dto';
import { PrismaService } from '../database/prisma.service';
import { Quotation } from '@prisma/client';

@Injectable()
export class QuotationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateLableDto) {
    try {
      const { mention } = dto;
      const label = await this.prismaService.quotation.findFirst({
        where: { mention },
      });
      if (label) throw new ConflictException('La quotation existe déjà');
      await this.prismaService.quotation.create({ data: dto });
    } catch {
      throw new ConflictException('Erreur lors de la création de la quotation');
    }
  }

  async findAll() {
    const data: Quotation[] = await this.prismaService.quotation.findMany({});
    return { data };
  }

  async findOne(id: number) {
    try {
      const data: Quotation = await this.prismaService.quotation.findUnique({
        where: { id },
      });
      if (!data) throw new NotFoundException("La quotation n'a pas été trouvé");
      return { data };
    } catch {
      throw new NotFoundException(
        'Erreur lors de la récupération de la quotation',
      );
    }
  }

  async update(id: number, dto: UpdateLableDto) {
    try {
      await this.findOne(id);
      const data: Quotation = await this.prismaService.quotation.update({
        data: dto,
        where: { id },
      });
      return { data };
    } catch {
      throw new ConflictException(
        'Erreur lors de la mise à jour de la quotation',
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.quotation.delete({
        where: { id },
      });
    } catch {
      throw new ConflictException(
        'Erreur lors de la suppression de la quotation',
      );
    }
  }
}
