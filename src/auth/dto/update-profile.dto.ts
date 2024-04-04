import { IsNotEmpty, IsOptional } from 'class-validator';
import { Match } from '../decorators/match.decorator';

export default class UpdateProfileDto {
  @IsNotEmpty({ message: "Le nom d'utilisateur est obligatoire" })
  name: string;

  @IsNotEmpty({ message: 'Le numéro de télephone est obligatoire' })
  phoneNumber: string;

  @IsNotEmpty({ message: "L'adresse est obligatoire" })
  address: string;

  @Match('password', { message: 'Les mots de passe ne correspondent pas' })
  passwordConfirm: string;

  @IsOptional()
  oldPassword: string;

  @IsOptional()
  password: string;
}
