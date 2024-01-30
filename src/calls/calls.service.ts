import { Call } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CallsService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async create(dto: CreateCallDto) {
    const data: Call | null = await this.prisma.call.create({
      data: dto
    });
    return { data };
  }

  async findAll() {
    const data: Call[] = await this.prisma.call.findMany({});
    return { data };
  }

  async findOne(id: number) {
    const data = await this.prisma.call.findUnique({
      where: { id },
      include: { thematics: true },
    });
    if (!data) throw new NotFoundException('L\'appel à solution introuvable');
    return { data };
  }

  async update(id: number, dto: UpdateCallDto) {
    await this.findOne(id)
    const data: Call | null = await this.prisma.call.update({
      data: dto,
      where: { id },
    });
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prisma.call.delete({
      where: { id },
    });
  }
}
