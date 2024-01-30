import { IsNotEmpty, IsOptional } from 'class-validator';

export default class UpdateProfileDto {
  @IsNotEmpty({ message: 'Le nom d\'utilisateur est obligatoire' })
  name: string;

  @IsNotEmpty({ message: 'Le numéro de télephone est obligatoire' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'L\'adresse est obligatoire' })
  address: string;

  @IsOptional()
  oldPassword: string

  @IsOptional()
  password: string
}