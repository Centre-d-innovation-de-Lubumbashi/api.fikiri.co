import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty({
    message: 'Le code ne peut pas être vide'
  })
  token: string;

  @IsNotEmpty({
    message: 'Le mot de passe ne peut pas être vide'
  })
  password: string;
}