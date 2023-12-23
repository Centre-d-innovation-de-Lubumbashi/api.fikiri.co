import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

@Injectable()
export class SolutionsService {
  constructor(
    private prismaService: PrismaService,
  ) {
  }

  async create(createSolutionDto: Prisma.SolutionCreateInput & {
    thematic: number,
    call: number,
    challenges: number[],
    user: string
  }) {
    try {
      await this.prismaService.solution.create({
        data: {
          ...createSolutionDto,
          thematic: {
            connect: {
              id: createSolutionDto.thematic,
            },
          },
          user: {
            connect: {
              email: createSolutionDto.user,
            },
          },
          call: {
            connect: {
              id: createSolutionDto.call,
            },
          },
          status: {
            connect: {
              id: 1,
            },
          },
          challenges: {
            connect: createSolutionDto.challenges.map((id) => ({ id })),
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
      // skip: offset,
      // take: limit,
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

  async update(id: number, updateSolutionDto: Prisma.SolutionUpdateInput & { status: number }) {
    try {
      await this.prismaService.solution.update({
        data: {
          ...updateSolutionDto,
          status: {
            connect: {
              id: updateSolutionDto.status,
            },
          },
        },
        where: { id },
      });
    } catch {
      throw new HttpException(
        'Thématiques non valides',
        HttpStatus.BAD_REQUEST,
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Mise à jour de la solution réussie',
    };
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
   }finally {
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
    if (!solution) throw new NotFoundException('L\'utilisateur n\'existe pas');
    await unlinkAsync(`./uploads/${solution.imageLink}`);
    await this.prismaService.solution.update({
      where: { id },
      data: {
        ...solution,
        imageLink: null,
      },
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'L\'image a été suppimé',
    };
  }
}
