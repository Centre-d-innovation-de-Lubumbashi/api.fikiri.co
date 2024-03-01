import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

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

  async solutionsByPole(poleId: number) {
    try {
      const data = await this.prismaService.solution.findMany({
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

  async findMapped() {
    const solutions = await this.getSolutions();
    const data = solutions.filter((solution) => solution.status.id > 1);
    return { data };
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async getPaginatedData(page: number) {
    // await this.sleep(1000);
    if (isNaN(page) || page < 0) page = 1;
    const take = page * 12;
    const data = await this.prismaService.solution.findMany({
      take,
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
      // Add other conditions or sorting if needed
    });
    return { data };
  }

  async getSolutions() {
    return await this.prismaService.solution.findMany({
      // skip: offset,
      // take: limit,
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
  }

  async findConforms(page: number) {
    const solutions = await this.getSolutions();
    const data = solutions.filter(
      (solution) =>
        solution.videoLink || solution.images.length > 0 || solution.imageLink,
    );
    return { data };
  }

  async findCurated(page: number) {
    const solutions = await this.getSolutions();
    const data = solutions.filter((solution) => solution.feedbacks.length > 0);
    return { data };
  }

  async findNonConforms(page: number) {
    const solutions = await this.getSolutions();
    const data = solutions.filter(
      (solution) =>
        !solution.videoLink &&
        !(solution.images.length > 0 || solution.imageLink),
    );
    return { data };
  }
}
