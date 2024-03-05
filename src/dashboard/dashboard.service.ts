import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCounts() {
    const totalUsers = await this.prismaService.user.count();
    const totalSolutions = await this.prismaService.solution.count();
    return {
      data: {
        totalUsers,
        totalSolutions,
      },
    };
  }

  async getUsers() {
    const data = await this.prismaService.user.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { data };
  }

  async countByStatus() {
    const data = await this.prismaService.solution.groupBy({
      by: ['statusId'],
      _count: true,
    });
    const status = await this.prismaService.status.findMany();
    const statusMap = status.reduce((acc, curr) => {
      acc.push({ id: curr.id, name: curr.name });
      return acc;
    }, []);
    const formattedData = statusMap.map((item) => {
      const count = data.find((d) => d.statusId === item.id)?._count ?? 0;
      return {
        status: item.name,
        count,
      };
    });
    return { data: formattedData };
  }

  async getSolutions() {
    const data = await this.prismaService.solution.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { data };
  }

  async getSolutionsAndThematics() {
    const data = await this.prismaService.solution.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        thematic: true,
      },
    });
    return { data };
  }
}
