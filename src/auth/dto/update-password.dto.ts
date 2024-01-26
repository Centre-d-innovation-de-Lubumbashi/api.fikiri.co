import { MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;
}