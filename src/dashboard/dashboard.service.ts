import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getCounts() {
    const totalUsers = await this.prismaService.user.count();
    const totalSolutions = await this.prismaService.solution.count();
    return {
      totalUsers,
      totalSolutions,
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

  async getSolutionStatus() {
    const data = await this.prismaService.solution.groupBy({
      by: ['statusId'],
      _count: true,
    });
    const status = await this.prismaService.status.findMany();
    const statusMap = status.reduce((acc, curr) => {
      acc[curr.id] = curr.name;
      return acc;
    }, {});
    const formattedData = data.map((item) => {
      return {
        status: statusMap[item.statusId],
        count: item._count,
      };
    });
    return { data: formattedData, status, statusMap };
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
        thematic: true,
      },
    });
    return { data };
  }
}
