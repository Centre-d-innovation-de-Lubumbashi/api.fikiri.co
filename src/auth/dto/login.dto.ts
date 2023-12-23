import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'L\'email saisi est invalide' })
  email: string;

  @MinLength(4, { message: 'Minimum 4 caractères' })
  password: string;
}