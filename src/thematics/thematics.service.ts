import { PrismaService } from '../database/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateThematicDto } from './dto/create-thematic.dto';
import { UpdateThematicDto } from './dto/update-thematic.dto';

@Injectable()
export class ThematicsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  async create(data: CreateThematicDto) {
    const thematic = await this.prismaService.thematic.create({ data });
    return {
      message: 'La thématique ajouté avec succès',
      data: thematic,
    };
  }

  async findAll() {
    const thematics = await this.prismaService.thematic.findMany();
    return {
      data: thematics,
    };
  }

  async findOne(id: number) {
    const thematic = await this.prismaService.thematic.findUnique({
      where: { id },
      include: {
        challenges: true,
      },
    });
    if (!thematic) throw new NotFoundException('La thématique n\'a pas été trouvé');
    return {
      data: thematic,
    };
  }

  async update(id: number, data: UpdateThematicDto) {
    const thematic = await this.prismaService.thematic.findUnique({
      where: { id },
    });
    if (!thematic) throw new NotFoundException('La thématique n\'a pas été trouvé');
    const updatedThematic = await this.prismaService.thematic.update({
      data,
      where: { id },
    });
    return {
      data: updatedThematic,
      message: 'La thématique est mis à jour avec succès',
    };
  }

  async remove(id: number) {
    const thematic = await this.prismaService.thematic.findUnique({
      where: { id },
    });
    if (!thematic) throw new Notification('La thématique n\'a pas été trouvé');
    await this.prismaService.thematic.delete({
      where: { id },
    });
    return {
      message: 'La thématique a été supprimé avec succès',
    };
  }
}
