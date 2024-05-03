import { IsNotEmpty } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty({ message: 'Le nom ne peut pas être vide' })
  name: string;

  @IsNotEmpty({ message: 'La description ne peut pas être vide' })
  description: string;

  @IsNotEmpty({ message: 'La date de début ne peut pas être vide' })
  startedAt: Date;

  @IsNotEmpty({ message: 'La date de fin ne peut pas être vide' })
  endedAt: Date;
}
