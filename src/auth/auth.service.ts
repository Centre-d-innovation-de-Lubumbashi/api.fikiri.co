import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { CurrentUser } from './decorators/user.decorator';
import { SignupDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import UpdateProfileDto from './dto/update-profile.dto';
import { EmailService } from 'src/email/email.service';
import { User } from '../users/entities/user.entity';
import { randomPassword } from '../helpers/random-password';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async validateUser(email: string, password: string): Promise<{ data: User }> {
    const { data } = await this.usersService.findByEmail(email);
    const passwordMatch: boolean = await this.passwordMatch(
      password,
      data.password,
    );
    if (!passwordMatch)
      throw new BadRequestException('Les identifiants saisis sont invalides');
    return { data };
  }

  async passwordMatch(password: string, hash: string): Promise<boolean> {
    if (!hash) return false;
    return await bcrypt.compare(password, hash);
  }

  async loginGoogle(@Res() res: Response): Promise<void> {
    return res.redirect(this.configService.get('FRONTEND_URI'));
  }

  async login(@Req() req: Request): Promise<{ data: Express.User }> {
    const data: Express.User = req.user;
    return { data };
  }

  async logout(
    @Req() request: Request,
  ): Promise<{ data: { message: string } }> {
    request.session.destroy(() => {});
    return {
      data: {
        message: 'Vous avez été déconnecté avec succès',
      },
    };
  }

  async profile(@CurrentUser() data: User): Promise<{ data: User }> {
    return { data };
  }

  async updateProfile(
    @CurrentUser() currentUser: User,
    dto: UpdateProfileDto,
  ): Promise<{ data: User }> {
    return await this.usersService.updateProfile(currentUser, dto);
  }

  async register(registerDto: SignupDto): Promise<{ data: User }> {
    const { data } = await this.usersService.register(registerDto);
    return { data };
  }

  async updatePassword(
    @CurrentUser() user: User,
    dto: UpdatePasswordDto,
  ): Promise<{ data: { message: string } }> {
    const { password } = dto;
    if (user.password) {
      const isMatch: boolean = await this.passwordMatch(
        dto.old_password,
        user.password,
      );
      if (!isMatch)
        throw new BadRequestException("L'ancien mot de passe est incorrect");
    }
    try {
      await this.usersService.updatePassword(user.id, password);
      return {
        data: {
          message: 'Votre mot de passe a été mis à jour avec succès',
        },
      };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la mise à jour du mot de passe',
      );
    }
  }

  async resetPasswordRequest(
    dto: ResetPasswordRequestDto,
  ): Promise<{ data: { message: string } }> {
    const { email } = dto;
    const { data: user } = await this.usersService.findByEmail(email);
    const token = randomPassword();
    await this.usersService.update(user.id, { token });
    await this.emailService.sendResetPasswordEmail(user, token);
    return {
      data: {
        message: 'Un email de réinitialisation de mot de passe a été envoyé',
      },
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ data: { message: string } }> {
    const { token, password } = resetPasswordDto;
    const { data: user } = await this.usersService.findByResetToken(token);
    try {
      await this.usersService.updatePassword(user.id, password);
      return {
        data: {
          message: 'Votre mot de passe a été réinitialisé avec succès',
        },
      };
    } catch {
      throw new BadRequestException(
        'Erreur lors de la réinitialisation du mot de passe',
      );
    }
  }
}
