import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export class SignupDto {
  @IsEmail({}, { message: 'L\'email saisi est invalide' })
  email: string;

  @MinLength(4, {
    message: 'Le mot de passe doit contenir au-moins 4 caractères',
  })
  password: string;

  @Match('password', { message: 'Les mots de passe ne correspondent pas' })
  passwordConfirm: string;

  @IsNotEmpty({ message: 'Le nom est obligatoire' })
  name: string;

  @MinLength(7, { message: 'Minimum 10 caractères' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'L\'adresse est obligatoire' })
  address: string;
}
