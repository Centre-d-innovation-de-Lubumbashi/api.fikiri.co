import { PrismaService } from '../database/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  async create(data: CreateRoleDto) {
    const name: string = data.name as string;
    const role = await this.prismaService.role.findFirst({
      where: { name },
    });
    if (role)
      throw new ConflictException('Le rôle existe déjà');
    await this.prismaService.role.create({ data });
    return {
      message: 'Rôle ajouté avec succès',
    };
  }

  async findAll(): Promise<any> {
    const roles = await this.prismaService.role.findMany({});
    return {
      data: roles,
    };
  }

  async findOne(id: number): Promise<any> {
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!role) throw new NotFoundException('Le rôle n\'a pas été trouvé');
    return {
      data: role,
    };
  }

  async update(id: number, data: UpdateRoleDto): Promise<any> {
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!role) throw new NotFoundException('Le rôle n\'a pas été trouvé');
    const newRole = await this.prismaService.role.update({
      data,
      where: { id },
    });
    return {
      message: 'Rôle mis à jour avec succès',
      data: newRole,
    };
  }

  async remove(id: number): Promise<any> {
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!role) throw new NotFoundException('Le rôle n\'a pas été trouvé');
    await this.prismaService.role.delete({
      where: { id },
    });
    return {
      message: 'Le rôle a été supprimé avec succès',
    };
  }
}
