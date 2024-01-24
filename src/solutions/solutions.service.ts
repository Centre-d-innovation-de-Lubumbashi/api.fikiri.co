import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as fs from 'fs';
import { promisify } from 'util';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';
import { UpdateUserSolutionDto } from './dto/update-user-solution.dto';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class SolutionsService {
  constructor(
    private prismaService: PrismaService,
  ) {
  }

  async create(data: CreateSolutionDto) {
    let solution = null;
    try {
      solution = await this.prismaService.solution.create({
        data: {
          ...data,
          thematic: {
            connect: {
              id: data.thematic,
            },
          },
          user: {
            connect: {
              email: data.user,
            },
          },
          call: {
            connect: {
              id: data.call,
            },
          },
          status: {
            connect: {
              id: 1,
            },
          },
          challenges: {
            connect: data.challenges.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException('Mauvaise demande, essayez à nouveau');
    }
    return {
      message: 'La solution a été ajouté avec succès',
      data: solution,
    };
  }

  async findApproved() {
    const solutions = await this.prismaService.solution.findMany({
      include: {
        thematic: true,
        status: true,
      },
    });
    const solutionsToDisplay = solutions.filter((solution) => solution.status.id > 1);
    return {
      data: solutionsToDisplay,
    };
  }

  async findAll() {
    const solutions = await this.prismaService.solution.findMany({
      include: {
        thematic: true,
        status: true,
      },
    });
    return {
      data: solutions,
    };
  }

  async findOne(id: number) {
    const solution = await this.prismaService.solution.findUnique({
      where: { id },
      include: {
        thematic: true,
        status: true,
      },
    });
    if (!solution)
      throw new NotFoundException('La solution n\'a pas été trouvé');
    return {
      data: solution,
    };
  }

  async findbyUser(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (user) {
      const solutions = await this.prismaService.solution.findMany({
        where: { userId: user.id },
        include: {
          status: true,
          images: true,
        },
      });
      return {
        data: solutions,
      };
    }
  }

  async findByCall(callId: number) {
    const solutions = await this.prismaService.solution.findMany({
      where: { callId },
      include: { thematic: true },
    });
    return {
      statusCode: HttpStatus.OK,
      data: solutions,
    };
  }

  async updateUserSolution(id: number, data: UpdateUserSolutionDto) {
    const soultion = await this.prismaService.solution.findUnique({
      where: { id },
    });
    if (!soultion) throw new NotFoundException('La solution est introuvable');
    let newSolution = null;
    try {
      newSolution = await this.prismaService.solution.update({
        where: { id },
        data: {
          ...data,
        },
      });
    } catch {
      throw new HttpException(
        'Erreur survenue lors de la mise à jour',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      data: newSolution,
      message: 'La solution a été mise à jour',
    };
  }

  async update(id: number, data: UpdateSolutionDto) {
    const soultion = await this.prismaService.solution.findUnique({
      where: { id },
    });
    if (!soultion) throw new NotFoundException('La solution est introuvable');
    let newSolution = null;
    try {
      newSolution = await this.prismaService.solution.update({
        where: { id },
        data: {
          ...data,
          thematic: {
            connect: {
              id: data.thematic,
            },
          },
          user: {
            connect: {
              email: data.user,
            },
          },
          call: {
            connect: {
              id: data.call,
            },
          },
          status: {
            connect: {
              id: 1,
            },
          },
          challenges: {
            connect: data.challenges.map((id: number) => ({ id })),
          },
        },
      });
    } catch {
      throw new BadRequestException('Mauvaise demande, essayez à nouveau');
    }
    return {
      message: 'La solution a été mise à jour',
      data: newSolution,
    };
  }

  async remove(id: number) {
    const solution = await this.prismaService.solution.findUnique({
      where: { id },
    });
    if (!solution) throw new NotFoundException('La solution n\'a pas été trouvé');
    await this.prismaService.solution.delete({
      where: { id },
    });
    return {
      message: 'La solution est supprimé avec succès',
    };
  }

  async uploadImages(id: number, images: Express.Multer.File[]) {
    await this.prismaService.solution.update({
      where: { id },
      data: {
        images: {
          create: images.map((image) => ({ imageLink: image.filename })),
        },
      },
    });
    return {
      message: 'L\'upload a réussi',
    };
  }

  async deleteImage(id: number): Promise<any> {
    const image = await this.prismaService.solutionImages.findUnique({
      where: { id },
    });
    if (!image) throw new NotFoundException('L\'image n\'a pas été trouvée');
    await unlinkAsync(`./uploads/${image.imageLink}`);
    await this.prismaService.solutionImages.delete({
      where: { id },
    });
    return {
      message: 'L\'image a été suppimé',
    };
  }
}
