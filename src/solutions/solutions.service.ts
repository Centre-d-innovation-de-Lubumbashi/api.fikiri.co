import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as fs from 'fs';
import { promisify } from 'util';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';
import { paginate } from 'src/helpers/paginate';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class SolutionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateSolutionDto) {
    try {
      await this.prismaService.solution.create({
        data: {
          ...dto,
          thematic: {
            connect: {
              id: dto.thematic,
            },
          },
          user: {
            connect: {
              email: dto.user,
            },
          },
          call: {
            connect: {
              id: dto.call,
            },
          },
          status: {
            connect: {
              id: 1,
            },
          },
          challenges: {
            connect: dto.challenges.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException(
        'Erreur lors de la création de la solution',
      );
    }
  }

  async findAll(page: number) {
    const { offset, limit } = paginate(page, 10);
    const data = await this.prismaService.solution.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        userId: true,
        description: true,
        videoLink: true,
        imageLink: true,
        thematic: true,
        challenges: true,
        status: true,
        user: true,
        images: true,
        feedbacks: true,
      },
    });
    return { data };
  }

  async findOne(id: number) {
    const data = await this.prismaService.solution.findUnique({
      where: { id },
      include: {
        thematic: true,
        user: true,
        status: true,
        images: true,
        feedbacks: {
          include: {
            user: true,
          },
        },
        challenges: true,
        pole: true,
      },
    });
    if (!data) throw new NotFoundException("La solution n'a pas été trouvé");
    return { data };
  }

  async findbyUser(email: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (user) {
        const data = await this.prismaService.solution.findMany({
          where: { userId: user.id },
          include: {
            status: true,
            images: true,
          },
        });
        return { data };
      }
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération de la solution',
      );
    }
  }

  async updateUserSolution(id: number, dto: UpdateUserSolutionDto) {
    try {
      await this.findOne(id);
      const data = await this.prismaService.solution.update({
        where: { id },
        data: {
          ...dto,
        },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la solution',
      );
    }
  }

  async update(id: number, dto: UpdateSolutionDto) {
    try {
      const { data: solution } = await this.findOne(id);
      const data = await this.prismaService.solution.update({
        where: { id },
        data: {
          ...dto,
          pole: {
            connect: {
              id: dto.pole ?? solution.poleId,
            },
          },
          thematic: {
            connect: {
              id: dto.thematic ?? solution.thematicId,
            },
          },
          user: {
            connect: {
              email: dto.user ?? solution.user.email,
            },
          },
          call: {
            connect: {
              id: dto.call ?? solution.callId,
            },
          },
          status: {
            connect: {
              id: dto.status ?? solution.statusId,
            },
          },
          challenges: {
            set:
              dto?.challenges?.map((id: number) => ({ id })) ??
              solution.challenges,
          },
        },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la mise à jour de la solution',
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prismaService.solution.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException(
        'Erreur lors de la suppression de la solution',
      );
    }
  }

  async uploadImages(id: number, images: Express.Multer.File[]) {
    try {
      await this.prismaService.solution.update({
        where: { id },
        data: {
          images: {
            create: images.map((image) => ({ imageLink: image.filename })),
          },
        },
      });
    } catch {
      throw new BadRequestException(
        "Erreur lors de l'ajout des images à la solution",
      );
    }
  }

  async deleteImage(id: number): Promise<any> {
    try {
      const image = await this.prismaService.solutionImages.findUnique({
        where: { id },
      });
      if (!image) throw new NotFoundException("L'image n'a pas été trouvée");
      await unlinkAsync(`./uploads/${image.imageLink}`);
      await this.prismaService.solutionImages.delete({
        where: { id },
      });
    } catch {
      throw new BadRequestException("Erreur lors de la suppression de l'image");
    }
  }
}
