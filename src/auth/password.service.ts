import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CurrentUser } from './decorators/user.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { randomPassword } from '../helpers/random-password';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class PasswordService {
  constructor(
    private readonly userService: UsersService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {
  }

  async updatePassword(@CurrentUser() user: User, dto: UpdatePasswordDto) {
    const { password } = dto;
    await this.userService.updatePassword(user.id, password);
    return {
      statusCode: HttpStatus.OK,
      message: 'Mot de passe mis à jour',
    };
  }

  async resetPasswordEmail(to: User, token: string) {
    let from = `Support fikiri <${this.configService.get('MAIL_USERNAME')}>`
    await this.mailService.sendMail({
      to: to.email,
      from,
      subject: 'Objet : Code de Réinitialisation de Mot de Passe Fikiri',
      text: `
Cher(e) ${to.name},

Pour réinitialiser votre mot de passe, utilisez le code suivant : ${token}.
          
Veuillez vous rendre sur la page de réinitialisation et suivre les instructions pour finaliser le processus.
      
Si vous n'avez pas initié cette demande, veuillez contacter notre équipe de support dès que possible.
          
Merci,
L'équipe Fikiri.`,
    });
  }

  async resetPasswordRequest(dto: ResetPasswordRequestDto) {
    const { email } = dto;
    const user = await this.userService.findByEmail(email);
    const token = randomPassword()
    await this.userService.saveResetToken(user.id, token);
    await this.resetPasswordEmail(user, token)
    return {
      statusCode: HttpStatus.OK,
      message: 'Code envoyé avec succès',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, password } = resetPasswordDto;
    const user = await this.userService.findByResetToken(token);
    await this.userService.removeResetToken(user.id);
    await this.userService.updatePassword(user.id, password);
    return {
      statusCode: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }
}