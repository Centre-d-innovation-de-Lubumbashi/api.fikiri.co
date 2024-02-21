import { PrismaService } from './../database/prisma.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { Organisation } from '@prisma/client';

@Injectable()
export class OrganisationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateOrganisationDto) {
    try {
      const name: string = dto.name;
      const organization = await this.prismaService.organisation.findFirst({
        where: { name },
      });
      if (organization)
        throw new ConflictException('Cette organisation existe déjà');
      await this.prismaService.organisation.create({ data: dto });
    } catch {
      throw new ConflictException("Impossible de créer l'organisation");
    }
  }

  async findAll() {
    const data: Organisation[] =
      await this.prismaService.organisation.findMany();
    return { data };
  }

  async findOne(id: number) {
    try {
      const data: Organisation =
        await this.prismaService.organisation.findUnique({
          where: { id },
        });
      if (!data)
        throw new NotFoundException("Cette organisation n'a pas été trouvée");
      return { data };
    } catch {
      throw new NotFoundException("Impossible de récupérer l'organisation");
    }
  }

  async update(id: number, dto: UpdateOrganisationDto) {
    try {
      await this.findOne(id);
      const data: Organisation = await this.prismaService.organisation.update({
        data: dto,
        where: { id },
      });
      return { data };
    } catch {
      throw new ConflictException("Impossible de mettre à jour l'organisation");
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.organisation.delete({
        where: { id },
      });
    } catch {
      throw new ConflictException("Impossible de supprimer l'organisation");
    }
  }
}
