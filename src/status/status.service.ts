import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Injectable()
export class StatusService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  async create(data: CreateStatusDto) {
    const status = await this.prismaService.status.create({
      data,
    });
    return {
      message: 'Le status a été créé avec succès',
      data: status,
    };
  }

  async findAll() {
    const status = await this.prismaService.status.findMany();
    return {
      data: status,
    };
  }

  async findOne(id: number) {
    const status = await this.prismaService.status.findUnique({
      where: { id },
    });
    return {
      data: status,
    };
  }

  async update(id: number, data: UpdateStatusDto) {
    const status = await this.prismaService.status.update({
      where: { id },
      data,
    });
    return {
      message: 'Le status a été modifié avec succès',
      data: status,
    };
  }

  async delete(id: number) {
    await this.prismaService.status.delete({
      where: { id },
    });
    return {
      message: 'Le status a été supprimé avec succès',
    };
  }
}
