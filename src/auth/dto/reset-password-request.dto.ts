import { IsEmail } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;
}