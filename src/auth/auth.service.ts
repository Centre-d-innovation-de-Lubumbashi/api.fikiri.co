import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { randomPassword } from './../helpers/random-password';
import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import e, { Request, Response } from 'express';
import { CurrentUser } from './decorators/user.decorator';
import { SignupDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import UpdateProfileDto from './dto/update-profile.dto';
import { User } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly mailService: MailerService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findBy(email);
    if (password) {
      const passwordMatch: boolean = await this.passwordMatch(
        password,
        user.password,
      );
      if (!passwordMatch)
        throw new BadRequestException('Les identifiants saisis sont invalides');
    }
    return user;
  }
  async passwordMatch(password: string, hash: string) {
    if (!hash)
      throw new BadRequestException('Les identifiants saisis sont invalides');
    return await bcrypt.compare(password, hash);
  }

  async loginGoogle(@Res() res: Response) {
    return res.redirect(this.configService.get('FRONTEND_URI'));
  }

  async login(@Req() req: Request) {
    const data = req.user;
    return { data };
  }

  async logout(@Req() request: Request) {
    request.session.destroy(() => {});
  }

  async profile(@CurrentUser() data: User) {
    return { data };
  }

  async updateProfile(id: number, dto: UpdateProfileDto) {
    return await this.usersService.updateProfile(+id, dto);
  }

  async register(registerDto: SignupDto) {
    const { data } = await this.usersService.register(registerDto);
    return { data };
  }

  async updatePassword(@CurrentUser() user: User, dto: UpdatePasswordDto) {
    const { password } = dto;
    await this.usersService.updatePassword(user.id, password);
  }

  async resetPasswordEmail(to: User, token: string) {
    let from = `Support fikiri <${this.configService.get('MAIL_USERNAME')}>`;
    try {
      await this.mailService.sendMail({
        to: to.email,
        from,
        subject: 'Code de Réinitialisation de Mot de Passe Fikiri',
        text: `
Cher(e) ${to.name},

Pour réinitialiser votre mot de passe, utilisez le code suivant : ${token}.
          
Veuillez vous rendre sur la page de réinitialisation et suivre les instructions pour finaliser le processus.
      
Si vous n'avez pas initié cette demande, veuillez contacter notre équipe de support dès que possible.
          
Merci,
L'équipe Fikiri.`,
      });
    } catch {
      throw new BadRequestException("Erreur lors de l'envoi du mail");
    }
  }

  async resetPasswordRequest(email: string) {
    const user = await this.usersService.findBy(email);
    const token = randomPassword();
    await this.usersService.saveResetToken(email, token);
    await this.resetPasswordEmail(user, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password, email } = resetPasswordDto;
    const resetToken = randomPassword();
    await this.usersService.findBy(email);
    const user = await this.usersService.findByResetToken(token);
    await this.usersService.saveResetToken(email, resetToken);
    await this.resetPasswordEmail(user, resetToken);
    try {
      await this.usersService.removeResetToken(user.id);
      await this.usersService.updatePassword(user.id, password);
    } catch {
      throw new BadRequestException(
        'Erreur lors de la réinitialisation du mot de passe',
      );
    }
  }
}
