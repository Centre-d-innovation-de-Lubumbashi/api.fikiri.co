import { PrismaService } from '../database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThematicDto } from './dto/create-thematic.dto';
import { UpdateThematicDto } from './dto/update-thematic.dto';
import { Thematic } from '@prisma/client';

@Injectable()
export class ThematicsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(dto: CreateThematicDto) {
    const data: Thematic = await this.prismaService.thematic.create({
      data: dto
    });
    return { data };
  }

  async findAll() {
    const data: Thematic[] = await this.prismaService.thematic.findMany();
    return { data };
  }

  async findOne(id: number) {
    const data: Thematic = await this.prismaService.thematic.findUnique({
      where: { id },
      include: {
        challenges: true,
      },
    });
    if (!data) throw new NotFoundException('La thématique n\'a pas été trouvé');
    return { data };
  }

  async update(id: number, dto: UpdateThematicDto) {
    await this.findOne(id)
    const data: Thematic = await this.prismaService.thematic.update({
      data: dto,
      where: { id },
    });
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prismaService.thematic.delete({
      where: { id },
    });
  }
}
