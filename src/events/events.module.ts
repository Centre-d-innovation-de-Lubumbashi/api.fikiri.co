import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EcentsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EcentsController],
  providers: [EventsService]
})
export class EventsModule {}
