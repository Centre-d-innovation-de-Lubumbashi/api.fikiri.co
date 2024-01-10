import { PrismaService } from '../database/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const role = await this.prismaService.role.findUnique({
      where: { name },
    });
    if (role)
      throw new HttpException('Le rôle existe déjà', HttpStatus.CONFLICT);
    await this.prismaService.role.create({ data });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Rôle ajouté avec succès',
    };
  }

  async findAll(): Promise<any> {
    const roles = await this.prismaService.role.findMany({});
    return {
      statusCode: HttpStatus.OK,
      roles,
    };
  }

  async findOne(id: number): Promise<any> {
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!role) throw new HttpException('Le rôle n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    return {
      statusCode: HttpStatus.OK,
      role,
    };
  }

  async update(id: number, data: UpdateRoleDto): Promise<any> {
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!role) throw new HttpException('Le rôle n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    await this.prismaService.role.update({
      data,
      where: { id },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Rôle mis à jour avec succès',
    };
  }

  async remove(id: number): Promise<any> {
    const role = await this.prismaService.role.findUnique({
      where: { id },
    });
    if (!role) throw new HttpException('Le rôle n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    await this.prismaService.role.delete({
      where: { id },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Le rôle a été supprimé avec succès',
    };
  }
}
