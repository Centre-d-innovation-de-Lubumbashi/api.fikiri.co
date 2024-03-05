import { Controller, Delete, Get, Param } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(private readonly feedbacksService: FeedbacksService) {}

  @Get()
  findAll() {
    return this.feedbacksService.findAll();
  }

  @Delete(':id')
  @Roles(RoleEnum.Admin)
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(+id);
  }
}
