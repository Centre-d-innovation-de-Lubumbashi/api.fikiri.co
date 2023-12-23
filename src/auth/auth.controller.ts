import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('login')
  loginWithCredentials(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }

  @Get('profile/:email')
  profile(@Param('email') email: string): Promise<any> {
    return this.authService.profile(email);
  }

  @Post('register')
  register(@Body() signupDto: SignupDto): Promise<any> {
    return this.authService.register(signupDto);
  }
}
