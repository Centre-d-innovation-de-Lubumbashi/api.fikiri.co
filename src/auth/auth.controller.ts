import {
  Body,
  Controller,
  Get, Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { SignupDto } from './dto/register.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Get('logout')
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
  @Post('register')
  register(@Body() registerDto: SignupDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Get('profile/:email')
  profile(@Param('email') email: string): Promise<any> {
    return this.authService.profile(email);
  }
}
