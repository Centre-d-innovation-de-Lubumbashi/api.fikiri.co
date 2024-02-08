import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async getDashboardData() {
        const totalUsers = await this.prismaService.user.count();
        const totolsCalls = await this.prismaService.call.count();
        const totalSolutions = await this.prismaService.solution.count();
        const groupStatus = await this.prismaService.solution.groupBy({
            by: ['statusId'],
            _count: true,
        });
        const groupPole = await this.prismaService.solution.groupBy({
            by: ['poleId'],
            _count: true
        });
        return {
            totalUsers,
            totolsCalls,
            totalSolutions,
            groupStatus,
            groupPole
        }
    }
}
