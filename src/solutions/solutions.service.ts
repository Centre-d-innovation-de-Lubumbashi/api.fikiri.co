import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import * as fs from 'fs';
import { promisify } from 'util';
import { CreateSolutionDto } from './dto/create-solution.dto';
import { UpdateSolutionDto } from './dto/update-solution.dto';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class SolutionsService {
  constructor(
    private prismaService: PrismaService,
  ) {
  }

  async create(data: CreateSolutionDto) {
    try {
      await this.prismaService.solution.create({
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
      throw new HttpException(
        'Mauvaise demande, essayez à nouveau',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: 'La solution a été ajouté avec succès',
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
      statusCode: HttpStatus.OK,
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
      statusCode: HttpStatus.OK,
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
      throw new HttpException(
        'La solution n\'a pas été trouvé',
        HttpStatus.NOT_FOUND,
      );
    return {
      statusCode: HttpStatus.OK,
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
        },
      });
      return {
        statusCode: HttpStatus.OK,
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

  async update(id: number, data: UpdateSolutionDto) {
    try {
      await this.prismaService.solution.update({
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
              id: data.status,
            },
          },
          challenges: {
            connect: data.challenges.map((id) => ({ id })),
          },
        },
      });
    } catch {
      throw new HttpException(
        'Mauvaise demande, essayez à nouveau',
        HttpStatus.BAD_REQUEST,
      );
    }

  }

  async remove(id: number) {
    const solution = await this.prismaService.solution.findUnique({
      where: { id },
    });
    if (!solution)
      throw new HttpException(
        'La solution n\'a pas été trouvé',
        HttpStatus.NOT_FOUND,
      );
    await this.prismaService.solution.delete({
      where: { id },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'La solution est supprimé avec succès',
    };
  }

  async uploadImage(id: number, image: Express.Multer.File): Promise<any> {
    const solution = await this.prismaService.solution.findUnique({
      where: { id },
    });
    try {
      if (solution.imageLink) {
        await unlinkAsync(`./uploads/${solution.imageLink}`);
      }
    } finally {
      await this.prismaService.solution.update({
        where: { id },
        data: {
          imageLink: image.filename,
        },
      });
    }
    return {
      statusCode: HttpStatus.CREATED,
      message: 'L\'upload a réussi',
    };
  }

  async deleteImage(id: number): Promise<any> {
    const solution = await this.prismaService.solution.findUnique({
      where: { id },
    });
    if (!solution)
      throw new HttpException(
        'La solution n\'a pas été trouvé',
        HttpStatus.NOT_FOUND,
      );
    await unlinkAsync(`./uploads/${solution.imageLink}`);
    await this.prismaService.solution.update({
      where: { id },
      data: {
        imageLink: null,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'L\'image a été suppimé',
    };
  }
}
