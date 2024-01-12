import { IsNotEmpty } from 'class-validator';

export class CreateThematicDto {
  @IsNotEmpty({ message: 'Le nom de la thématique est obligatoire' })
  name: string;

  @IsNotEmpty({ message: 'Les odds de la thématique sont obligatoires' })
  odds: string;
}