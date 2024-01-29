import { PartialType } from '@nestjs/mapped-types';
import { CreateLableDto } from './create-lable.dto';

export class UpdateLableDto extends PartialType(CreateLableDto) {}
