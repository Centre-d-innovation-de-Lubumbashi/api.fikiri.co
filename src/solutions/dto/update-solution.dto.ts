import { CreateSolutionDto } from './create-solution.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateSolutionDto extends PartialType<CreateSolutionDto>(CreateSolutionDto) {
}