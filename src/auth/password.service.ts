import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CurrentUser } from './decorators/user.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { randomPassword } from '../helpers/random-password';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UsersPasswordService } from 'src/users/users-password.service';

@Injectable()
export class PasswordService {
  constructor(
    private readonly userService: UsersService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
    private readonly usersPasswordService: UsersPasswordService
  ) { }

  async updatePassword(@CurrentUser() user: User, dto: UpdatePasswordDto) {
    const { password } = dto;
    await this.usersPasswordService.updatePassword(user.id, password);
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
    const user = await this.userService.findBy(email);
    const token = randomPassword()
    await this.usersPasswordService.saveResetToken(user.id, token);
    await this.resetPasswordEmail(user, token)
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
    const { token, password } = resetPasswordDto;
    const user = await this.usersPasswordService.findByResetToken(token);
    await this.usersPasswordService.removeResetToken(user.id);
    await this.usersPasswordService.updatePassword(user.id, password);
  }
}