import { HttpStatus, Injectable } from '@nestjs/common';
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
    await this.prismaService.status.create({
      data,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Le status a été créé avec succès',
    };
  }

  async findAll() {
    const status = await this.prismaService.status.findMany();
    return {
      statusCode: HttpStatus.OK,
      data: status,
    };
  }

  async findOne(id: number) {
    const status = await this.prismaService.status.findUnique({
      where: { id },
    });
    return {
      statusCode: HttpStatus.OK,
      data: status,
    };
  }

  async update(id: number, data: UpdateStatusDto) {
    await this.prismaService.status.update({
      where: { id },
      data,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Le status a été modifié avec succès',
    };
  }

  async delete(id: number) {
    await this.prismaService.status.delete({
      where: { id },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Le status a été supprimé avec succès',
    };
  }
}
