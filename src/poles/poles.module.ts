import { Module } from '@nestjs/common';
import { PolesService } from './poles.service';
import { PolesController } from './poles.controller';

@Module({
  controllers: [PolesController],
  providers: [PolesService],
})
export class PolesModule {}
