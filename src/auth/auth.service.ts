import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { randomPassword } from './../helpers/random-password';
import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { CurrentUser } from './decorators/user.decorator';
import { SignupDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import UpdateProfileDto from './dto/update-profile.dto';
import { User } from '@prisma/client';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
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

  async resetPasswordRequest(dto: ResetPasswordRequestDto) {
    const { email } = dto;
    const user = await this.usersService.findBy(email);
    const token = randomPassword();
    await this.usersService.saveResetToken(email, token);
    await this.emailService.sendResetPasswordRequest(user, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;
    const user = await this.usersService.findByResetToken(token);
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
