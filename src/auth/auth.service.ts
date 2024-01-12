import { BadRequestException, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CurrentUser } from './decorators/user.decorator';
import { SignupDto } from './dto/register.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
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
    return await bcrypt.compare(password, hash);
  }

  async loginGoogle(@Req() req: any, @Res() res: any) {
    await this.usersService.findOrCreate(req.user);
    return res.redirect('http://localhost:3000/me');
  }


  async login() {
    return {
      message: 'Connexion réussie',
      statusCode: HttpStatus.OK,
    };
  }

  async logout(@Req() request: Request) {
    request.session.destroy(() => {
    });
    return {
      message: 'Déconnexion réussie',
      statusCode: HttpStatus.OK,
    };
  }

  async profile(@CurrentUser() user: any) {
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  async updateProfile(@CurrentUser() user: any, data: UpdateUserDto) {
    const { id } = user;
    await this.usersService.update(+id, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Profil mis à jour avec succès',
    };
  }

  register(registerDto: SignupDto) {
    return this.usersService.register(registerDto);
  }
}
