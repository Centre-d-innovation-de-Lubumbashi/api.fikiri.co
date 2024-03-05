import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Injectable()
export class StatusService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateStatusDto) {
    try {
      await this.prismaService.status.create({
        data: dto,
      });
    } catch {
      throw new BadRequestException('Erreur lors de la création du status');
    }
  }

  async findAll() {
    const data: Status[] = await this.prismaService.status.findMany();
    return { data };
  }

  async findOne(id: number) {
    try {
      const data: Status = await this.prismaService.status.findUnique({
        where: { id },
      });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la récupération du status');
    }
  }

  @Roles(['ADMIN'])
  async update(id: number, dto: UpdateStatusDto) {
    try {
      await this.findOne(id);
      const data: Status = await this.prismaService.status.update({
        where: { id },
        data: dto,
      });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la mise à jour du status');
    }
  }

  @Roles(['ADMIN'])
  async delete(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.status.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException('Erreur lors de la suppression du status');
    }
  }
}
