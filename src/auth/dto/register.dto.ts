import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail({}, { message: 'L\'email saisi est invalide' })
  email: string;

  @MinLength(4, { message: 'Minimum 4 caractères' })
  password: string;

  @MinLength(4, { message: 'Minimum 4 caractères' })
  name: string;

  @MinLength(10, { message: 'Minimum 10 caractères' })
  phoneNumber: string;

  @MinLength(10, { message: 'Minimum 10 caractères' })
  address: string;
}