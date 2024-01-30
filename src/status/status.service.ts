import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from '@prisma/client';

@Injectable()
export class StatusService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(dto: CreateStatusDto) {
    const data: Status = await this.prismaService.status.create({
      data: dto,
    });
    return { data };
  }

  async findAll() {
    const data: Status[] = await this.prismaService.status.findMany();
    return { data };
  }

  async findOne(id: number) {
    const data: Status = await this.prismaService.status.findUnique({
      where: { id },
    });
    return { data };
  }

  async update(id: number, dto: UpdateStatusDto) {
    await this.findOne(id)
    const data: Status = await this.prismaService.status.update({
      where: { id },
      data: dto,
    });
    return { data };
  }

  async delete(id: number) {
    await this.findOne(id)
    await this.prismaService.status.delete({
      where: { id },
    });
  }
}
