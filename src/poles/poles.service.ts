import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePoleDto } from './dto/create-pole.dto';
import { UpdatePoleDto } from './dto/update-pole.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Pole } from '@prisma/client';

@Injectable()
export class PolesService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(dto: CreatePoleDto) {
    const pole: Pole | null = await this.prisma.pole.findFirst({
      where: { name: dto.name }
    })
    if (pole) throw new ConflictException('Ce pôle existe déjà')
    const data = await this.prisma.pole.create({
      data: dto
    })
    return { data }
  }

  async findAll() {
    const data = await this.prisma.pole.findMany()
    return { data }
  }

  async findOne(id: number) {
    const data: Pole | null = await this.prisma.pole.findFirst({
      where: { id }
    })
    if (!data) throw new NotFoundException('Ce pôle n\'existe pas')
    return { data }
  }

  async update(id: number, dto: UpdatePoleDto) {
    await this.findOne(id)
    const data: Pole | null = await this.prisma.pole.update({
      where: { id },
      data: dto
    })
    return { data }
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prisma.pole.delete({
      where: { id }
    })
  }
}
