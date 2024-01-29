import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @IsNotEmpty({ message: 'Les challenges sont obligatoires' })
  labels: number[];

  @IsNotEmpty({ message: 'Le commentaire pour admin est obligatoire' })
  adminComment: string;

  @IsNotEmpty({ message: 'Le commentaire pour utilisateur est obligatoire' })
  userComment: string;

  @IsNotEmpty({ message: 'L\'utilisateur qui ajoute le feedback est obligatoire' })
  user: string;
}