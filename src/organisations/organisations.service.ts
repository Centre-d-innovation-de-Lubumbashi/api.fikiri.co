import { PrismaService } from './../database/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from '@prisma/client';

@Injectable()
export class OrganisationsService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(dto: CreateOrganisationDto) {
    const name: string = dto.name
    const data = await this.prismaService.organisation.findFirst({
      where: { name },
    });
    if (data)
      throw new ConflictException('Cette organisation existe déjà');
    await this.prismaService.organisation.create({ data: dto });
    return { data };
  }

  async findAll() {
    const data: Organisation[] = await this.prismaService.organisation.findMany();
    return { data };
  }

  async findOne(id: number) {
    const data: Organisation = await this.prismaService.organisation.findUnique({
      where: { id },
    });
    if (!data) throw new NotFoundException('Cette organisation n\'a pas été trouvée');
    return { data };
  }

  async update(id: number, dto: UpdateOrganisationDto) {
    await this.findOne(id)
    const data: Organisation = await this.prismaService.organisation.update({
      data: dto,
      where: { id },
    });
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prismaService.organisation.delete({
      where: { id },
    });
  }
}
