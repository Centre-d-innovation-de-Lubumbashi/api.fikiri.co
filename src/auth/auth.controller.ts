import { Body, Controller, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { Request } from 'express';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { GoogleGuard } from './guards/google.guard';
import { SignupDto } from './dto/register.dto';
import UpdateProfileDto from './dto/update-profile.dto';
import { PasswordService } from './password.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordRequestDto } from './dto/reset-password-request.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authPasswordService: PasswordService,
  ) {
  }

  @Post('logout')
  logout(@Req() request: Request): Promise<any> {
    return this.authService.logout(request);
  }

  @Get('profile')
  profile(@CurrentUser() user: any): Promise<any> {
    return this.authService.profile(user);
  }

  @Patch('profile/:id')
  updateProfile(@Param('id') id: string, @Body() data: UpdateProfileDto) {
    return this.authService.updateProfile(+id, data);
  }

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req);
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('login')
  loginGoogle() {
  }

  @Public()
  @Post('register')
  register(@Body() data: SignupDto) {
    return this.authService.register(data);
  }

  @Public()
  @UseGuards(GoogleGuard)
  @Get('google/redirect')
  googleAuthRedirect(@Res() res: any) {
    return this.authService.loginGoogle(res);
  }

  @Patch('update-password')
  updatePassword(@CurrentUser() user: User, @Body() dto: UpdatePasswordDto) {
    return this.authPasswordService.updatePassword(user, dto);
  }

  @Public()
  @Post('reset-password-request')
  resetPasswordRequest(@Body() dto: ResetPasswordRequestDto): Promise<any> {
    return this.authPasswordService.resetPasswordRequest(dto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authPasswordService.resetPassword(dto);
  }

  @Public()
  @Get('is-authenticated')
  isAutheticated(@Req() req: Request) {
    return this.authService.isAutheticated(req);
  }
}     
