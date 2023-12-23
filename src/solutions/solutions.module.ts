import {Module} from '@nestjs/common';
import {SolutionsService} from './solutions.service';
import {SolutionsController} from './solutions.controller';

@Module({
    controllers: [SolutionsController],
    providers: [SolutionsService],
})
export class SolutionsModule {
}
