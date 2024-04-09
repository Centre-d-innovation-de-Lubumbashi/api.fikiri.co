import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Solution } from '../solutions/entities/solution.entity';
import { Status } from '../status/entities/status.entity';

@Injectable()
export class DashboardService {
  constructor(private readonly entityManager: EntityManager) {
  }

  async getCounts(): Promise<{ data: { totalUsers: number; totalSolutions: number } }> {
    const totalUsers: number = await this.entityManager
      .getRepository(User)
      .count();

    const totalSolutions: number = await this.entityManager
      .getRepository(Solution)
      .count();

    return {
      data: {
        totalUsers,
        totalSolutions,
      },
    };
  }

  async getUsers(): Promise<{ data: User[] }> {
    const data: User[] = await this.entityManager
      .getRepository(User)
      .find({
        select: ['id', 'created_at', 'updated_at'],
      });
    return { data };
  }

  async countByStatus(): Promise<{ data: { status: string; count: number }[] }> {
    const data: Solution[] = await this.entityManager
      .getRepository(Solution)
      .createQueryBuilder('solution')
      .select('solution.status.id, COUNT(solution.status.id) as count')
      .groupBy('solution.status_id')
      .getMany();

    const status: Status[] = await this.entityManager
      .getRepository(Status)
      .find();

    const statusMap: { id: number, name: string }[] = status.map((status) => ({ id: status.id, name: status.name }));

    const formattedData: { count: number, status: string }[] = statusMap.map((item) => {
      const countObj: Solution = data.find((d) => d.status.id === item.id);
      const count: number = countObj ? parseInt(countObj['count']) : 0;
      return {
        status: item.name,
        count,
      };
    });
    return { data: formattedData };
  }


  async getSolutions(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.entityManager
      .getRepository(Solution)
      .find({
        select: ['id', 'created_at', 'updated_at'],
      });
    return { data };
  }

  async getSolutionsAndThematics(): Promise<{ data: Solution[] }> {
    const data: Solution[] = await this.entityManager
      .getRepository(Solution)
      .find({
        select: ['id', 'created_at', 'updated_at', 'thematic'],
      });
    return { data };
  }
}
