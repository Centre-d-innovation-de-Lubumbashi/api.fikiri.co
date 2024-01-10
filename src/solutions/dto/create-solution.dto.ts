import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSolutionDto {
  @IsNotEmpty({ message: 'Le nom de la solution est obligatoire' })
  name: string;

  @IsOptional()
  videoLink: string;

  @IsOptional()
  imageLink: string;

  @IsNotEmpty({ message: 'La description de la solution est obligatoire' })
  description: string;

  @IsNotEmpty({ message: 'Le problème ciblé par la solution est obligatoire' })
  targetedProblem: string;

  @IsNotEmpty({ message: 'La thématique est obligatoire' })
  thematic: number;

  @IsNotEmpty({ message: 'L\'utilisateur est obligatoire' })
  user: string;

  @IsNotEmpty({ message: 'L\'appel est obligatoire' })
  call: number;

  @IsNotEmpty({ message: 'Le statut est obligatoire' })
  status: number;

  @IsNotEmpty({ message: 'Les challenges sont obligatoires' })
  challenges: number[];
}