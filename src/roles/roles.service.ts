import { PrismaService } from '../database/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(dto: CreateRoleDto) {
    const name: string = dto.name
    const data = await this.prismaService.role.findFirst({
      where: { name },
    });
    if (data)
      throw new ConflictException('Le rôle existe déjà');
    await this.prismaService.role.create({ data: dto });
    return { data };
  }

  async findAll() {
    const data: Role[] = await this.prismaService.role.findMany();
    return { data };
  }

  async findOne(id: number) {
    const data: Role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!data) throw new NotFoundException('Le rôle n\'a pas été trouvé');
    return { data };
  }

  async update(id: number, dto: UpdateRoleDto) {
    await this.findOne(id)
    const data: Role = await this.prismaService.role.update({
      data: dto,
      where: { id },
    });
    return { data };
  }

  async remove(id: number) {
    await this.findOne(id)
    await this.prismaService.role.delete({
      where: { id },
    });
  }
}
