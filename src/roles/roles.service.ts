import { PrismaService } from '../database/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateRoleDto) {
    try {
      const role = await this.prismaService.role.findFirst({
        where: { name: dto.name },
      });
      if (role) throw new ConflictException('Le rôle existe déjà');
      await this.prismaService.role.create({ data: dto });
    } catch {
      throw new ConflictException('Erreur lors de la création du rôle');
    }
  }

  async findAll() {
    const data: Role[] = await this.prismaService.role.findMany();
    return { data };
  }

  async findOne(id: number) {
    try {
      const data: Role = await this.prismaService.role.findUnique({
        where: { id },
      });
      if (!data) throw new NotFoundException("Le rôle n'a pas été trouvé");
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la récupération du rôle');
    }
  }

  async update(id: number, dto: UpdateRoleDto) {
    try {
      await this.findOne(id);
      const data: Role = await this.prismaService.role.update({
        data: dto,
        where: { id },
      });
      return { data };
    } catch {
      throw new BadRequestException('Erreur lors de la mise à jour du rôle');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.role.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException('Erreur lors de la suppression du rôle');
    }
  }
}
