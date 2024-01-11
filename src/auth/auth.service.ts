import { BadRequestException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { CurrentUser } from './decorators/user.decorator';
import { SignupDto } from './dto/register.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    const passwordMatch: boolean = await this.passwordMatch(
      password,
      user.password,
    );
    if (!passwordMatch) throw new BadRequestException('Les identifiants saisis sont invalides');
    return {
      user,
    };
  }

  // async validateUser(email: string, password: string): Promise<any> {
  //   const user = await this.usersService.findByEmail(email);
  //   const passwordMatch: boolean = await this.passwordMatch(
  //     password,
  //     user.password,
  //   );
  //   if (!passwordMatch)
  //     throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
  //
  //   return {
  //     id: user.id,
  //     email: user.email,
  //     name: user.name,
  //     roles: user.roles.map((role: any) => role.name),
  //   };
  // }

  async passwordMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async login(): Promise<any> {
    return {
      message: 'Connexion réussie',
      statusCode: HttpStatus.OK,
    };
  }

  async logout(@Req() request: Request): Promise<any> {
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
      message: 'Profit mis à jour avec succès',
    };
  }

  register(registerDto: SignupDto): Promise<any> {
    return this.usersService.register(registerDto);
  }
}
