import { Module } from '@nestjs/common';
import { ThematicsService } from './thematics.service';
import { ThematicsController } from './thematics.controller';

@Module({
    controllers: [ThematicsController],
    providers: [ThematicsService],
})
export class ThematicsModule {
}
