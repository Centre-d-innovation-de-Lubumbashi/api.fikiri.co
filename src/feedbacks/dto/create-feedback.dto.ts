import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
    @IsNotEmpty({ message: 'Les challenges sont obligatoires' })
    label: number;

    @IsNotEmpty({ message: 'Le commentaire pour admin est obligatoire' })
    adminComment: string;

    @IsOptional()
    userComment: string;

    @IsNotEmpty({ message: 'L\'utilisateur qui ajoute le feedback est obligatoire' })
    user: string;
}
