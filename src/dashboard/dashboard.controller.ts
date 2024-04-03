import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getCounts() {
    return this.dashboardService.getCounts();
  }

  @Get('users')
  async getUsers() {
    return this.dashboardService.getUsers();
  }

  @Get('solutions-status')
  async countByStatus() {
    return this.dashboardService.countByStatus();
  }

  @Get('solutions')
  async getSolutions() {
    return this.dashboardService.getSolutions();
  }

  @Get('solutions-thematics')
  async getSolutionsAndThematics() {
    return this.dashboardService.getSolutionsAndThematics();
  }
}
