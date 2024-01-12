import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: "L'email saisi est invalide" })
  email: string;

  @MinLength(4, { message: "Le mot de passe doit containir au-moins 4 caractères" })
  password: string;
}