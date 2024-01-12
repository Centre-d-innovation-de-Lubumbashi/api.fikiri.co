import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { GoogleGuard } from './guards/google.guard';
import { SignupDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('logout')
  logout(@Req() request: Request): Promise<any> {
    return this.authService.logout(request);
  }

  @Patch('profile')
  updateProfile(@CurrentUser() user: any, @Body() data: UpdateUserDto) {
    return this.authService.updateProfile(user, data);
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  login() {
    return this.authService.login();
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('login')
  loginGoogle() {
  }

  @Public()
  @Post('register')
  register(data: SignupDto) {
    return this.authService.register(data)
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  googleAuthRedirect(@Req() req: any, @Res() res: any) {
    return this.authService.loginGoogle(req, res);
  }

  @Get('profile')
  profile(@CurrentUser() user: any): Promise<any> {
    return this.authService.profile(user);
  }
}     
