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

  @Get('solution-status')
  async getSolutionStatus() {
    return this.dashboardService.getSolutionStatus();
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
