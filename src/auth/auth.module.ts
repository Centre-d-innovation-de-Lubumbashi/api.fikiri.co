import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { Session } from './session';
import { GoogleStrategy } from './strategies/google.strategy';
import { PasswordService } from './password.service';

@Module({
  imports: [UsersModule, PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [AuthService, PasswordService,LocalStrategy, Session, GoogleStrategy],
})

export class AuthModule {
}
