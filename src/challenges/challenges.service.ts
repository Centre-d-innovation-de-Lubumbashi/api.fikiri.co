import { PrismaService } from '../database/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) {
  }

  async create(data: CreateChallengeDto) {
    await this.prismaService.challenge.create({
      data: {
        ...data,
        thematics: {
          connect: data.thematics.map((id) => ({ id })),
        },
      },
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Le défi ajouté avec succès',
    };
  }

  async findAll() {
    const thematics = await this.prismaService.challenge.findMany();
    return {
      statusCode: HttpStatus.OK,
      data: thematics,
    };
  }

  async findOne(id: number) {
    const thematic = await this.prismaService.challenge.findUnique({
      where: { id },
    });
    if (!thematic) throw new HttpException('Le défi n\'a pas été trouvé', HttpStatus.NOT_FOUND);
    return {
      statusCode: HttpStatus.OK,
      thematic,
    };
  }

  async update(id: number, data: UpdateChallengeDto) {
    await this.prismaService.challenge.update({
      where: { id },
      data: {
        ...data,
        thematics: {
          connect: data.thematics.map((id) => ({ id })),
        },
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Le défi a été mis à jour avec succès',
    };
  }

  async remove(id: number) {
    await this.prismaService.challenge.delete({
      where: { id },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Le défi a été supprimé avec succès',
    };
  }

}
