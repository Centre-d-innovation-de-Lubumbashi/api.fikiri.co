import { Module } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CallsController } from './calls.controller';

@Module({
  controllers: [CallsController],
  providers: [CallsService],
})
export class CallsModule { }
