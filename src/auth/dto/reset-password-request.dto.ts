import { IsEmail } from 'class-validator';

export class ResetPasswordRequestDto {
  @IsEmail({}, {
    message: 'Ce champ ne peut pas être vide'
  })
  email: string;
}