import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { paginate } from 'src/helpers/paginate';

@Injectable()
export class SolutionsFiltersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMappedByCall(callId: number) {
    const solutions = await this.prismaService.solution.findMany({
      where: { callId },
      include: {
        thematic: true,
        status: true,
        user: true,
      },
    });
    const data = solutions.filter(
      (solution) => solution.status.id > 1 && solution.status.id < 5,
    );
    return { data };
  }

  async findByCall(callId: number) {
    try {
      const data = await this.prismaService.solution.findMany({
        where: { callId },
        include: { thematic: true },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération des solutions',
      );
    }
  }

  async solutionsByPole(page: number, poleId: number) {
    const { offset, limit } = paginate(page, 10);
    try {
      const data = await this.prismaService.solution.findMany({
        skip: offset,
        take: limit,
        where: { poleId },
        select: {
          id: true,
          name: true,
          user: true,
          userId: true,
          description: true,
          videoLink: true,
          imageLink: true,
          thematic: true,
          status: true,
          images: true,
          feedbacks: true,
        },
      });
      return { data };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la récupération des solutions par pôle',
      );
    }
  }

  async findMapped(cursor: number) {
    if (isNaN(cursor) || cursor <= 0) cursor = 1;
    const take = cursor * 8;
    const data = await this.prismaService.solution.findMany({
      take,
      where: {
        OR: [
          {
            statusId: {
              in: [2, 3, 4],
            },
          },
          {},
        ],
      },
      select: {
        id: true,
        name: true,
        userId: true,
        description: true,
        createdAt: true,
        updatedAt: true,
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

  async getSolutions(page: number) {
    const { offset, limit } = paginate(page, 10);
    return await this.prismaService.solution.findMany({
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
        createdAt: true,
        updatedAt: true,
        status: true,
        user: true,
        images: true,
        feedbacks: true,
      },
    });
  }

  async findConforms(page: number) {
    const solutions = await this.getSolutions(page);
    const data = solutions.filter(
      (solution) =>
        solution.videoLink || solution.images.length > 0 || solution.imageLink,
    );
    return { data };
  }

  async findCurated(page: number) {
    const solutions = await this.getSolutions(page);
    const data = solutions.filter((solution) => solution.feedbacks.length > 0);
    return { data };
  }

  async findNonConforms(page: number) {
    const solutions = await this.getSolutions(page);
    const data = solutions.filter(
      (solution) =>
        !solution.videoLink &&
        !(solution.images.length > 0 || solution.imageLink),
    );
    return { data };
  }

  async findIds() {
    const solutions = await this.prismaService.solution.findMany({
      select: {
        id: true,
        videoLink: true,
        imageLink: true,
        images: true,
        feedbacks: true,
      },
    });
    const allIds = solutions.map((solution) => solution.id);

    const conforms = solutions.filter(
      (solution) =>
        solution.videoLink || solution.imageLink || solution.images.length > 0,
    );

    const conformsIds = conforms.map((solution) => solution.id);

    const curated = solutions.filter(
      (solution) => solution.feedbacks.length > 0,
    );
    const curatedIds = curated.map((solution) => solution.id);

    return { data: { allIds, conformsIds, curatedIds } };
  }
}
