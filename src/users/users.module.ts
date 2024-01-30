import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersPasswordService } from './users-password.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersPasswordService],
  exports: [UsersService, UsersPasswordService],
})
export class UsersModule { }
