import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
  ) {
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    const passwordMatch: boolean = await this.passwordMatch(
      password,
      user.password,
    );
    if (!passwordMatch) throw new BadRequestException('Les identifiants saisis sont invalides');
    return {
      message: 'Connexion réussie',
      statusCode: HttpStatus.OK,
      user,
    };
  }


  async profile(email: string): Promise<any> {
    if (email) {
      const user = await this.userService.findByEmail(email);
      return {
        statusCode: HttpStatus.OK,
        user,
      };
    }
  }

  async passwordMatch(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  register(registerDto: SignupDto): Promise<any> {
    return this.userService.register(registerDto);
  }
}
