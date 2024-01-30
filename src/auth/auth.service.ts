import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CurrentUser } from './decorators/user.decorator';
import { SignupDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import UpdateProfileDto from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService) {
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findBy(email);
    if (password) {
      const passwordMatch: boolean = await this.passwordMatch(
        password,
        user.password,
      );
      if (!passwordMatch) throw new BadRequestException('Les identifiants saisis sont invalides');
    }
    return user;
  }


  async passwordMatch(password: string, hash: string) {
    if (!hash) throw new BadRequestException('Les identifiants saisis sont invalides');
    return await bcrypt.compare(password, hash);
  }

  async loginGoogle(@Res() res: any) {
    return res.redirect(this.configService.get('FRONTEND_URI'));
  }


  async login(@Req() req: Request) {
    return {
      message: 'Connexion réussie',
      data: req.user,
    };
  }

  async logout(@Req() request: Request) {
    request.session.destroy(() => {
    });
    return {
      message: 'Déconnexion réussie',
    };
  }

  async profile(@CurrentUser() user: any) {
    return {
      data: user,
    };
  }

  async updateProfile(id: number, data: UpdateProfileDto) {
    return await this.usersService.updateProfile(+id, data);
  }

  register(registerDto: SignupDto) {
    return this.usersService.register(registerDto);
  }
}
