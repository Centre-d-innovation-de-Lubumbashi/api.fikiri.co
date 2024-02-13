import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLableDto } from './dto/create-quotation.dto';
import { UpdateLableDto } from './dto/update-quotation.dto';
import { PrismaService } from '../database/prisma.service';
import { Quotation } from '@prisma/client';

@Injectable()
export class QuotationsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(dto: CreateLableDto) {
    let data: Quotation | null = null;
    const { mention } = dto;
    const label = await this.prismaService.quotation.findFirst({
      where: { mention },
    });
    if (label)
      throw new ConflictException('La quotation existe déjà');
    data = await this.prismaService.quotation.create({ data: dto });
    return { data };
  }

  async findAll() {
    const data: Quotation[] = await this.prismaService.quotation.findMany({});
    return { data };
  }

  async findOne(id: number) {
    const data: Quotation = await this.prismaService.quotation.findUnique({
      where: { id },
    });
    if (!data) throw new NotFoundException('La quotation n\'a pas été trouvé');
    return { data };
  }

  async update(id: number, dto: UpdateLableDto) {
    await this.findOne(id);
    const data: Quotation = await this.prismaService.quotation.update({
      data: dto,
      where: { id },
    });
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prismaService.quotation.delete({
      where: { id },
    });
  }
}
