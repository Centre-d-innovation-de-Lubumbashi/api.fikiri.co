import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { User } from '../users/entities/user.entity';
import { Solution } from '../solutions/entities/solution.entity';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {
  }

  @Get()
  async getCounts(): Promise<{ data: { totalUsers: number; totalSolutions: number } }> {
    return this.dashboardService.getCounts();
  }

  @Get('users')
  async getUsers(): Promise<{ data: User[] }> {
    return this.dashboardService.getUsers();
  }

  @Get('solutions-status')
  async countByStatus(): Promise<{ data: { status: string; count: number }[] }> {
    return this.dashboardService.countByStatus();
  }

  @Get('solutions')
  async getSolutions(): Promise<{ data: Solution[] }> {
    return this.dashboardService.getSolutions();
  }

  @Get('solutions-thematics')
  async getSolutionsAndThematics(): Promise<{ data: Solution[] }> {
    return this.dashboardService.getSolutionsAndThematics();
  }
}
