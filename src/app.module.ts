import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SolutionsModule } from './solutions/solutions.module';
import { ThematicsModule } from './thematics/thematics.module';
import { PrismaModule } from './database/prisma.module';
import { CallsModule } from './calls/calls.module';
import { ChallengesModule } from './challenges/challenges.module';
import { StatusModule } from './status/status.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { LabelsModule } from './labels/labels.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { PolesModule } from './poles/poles.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: true,
          auth: {
            user: config.get('MAIL_USERNAME'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../'),
      renderPath: '/uploads',
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    SolutionsModule,
    ThematicsModule,
    PrismaModule,
    CallsModule,
    ChallengesModule,
    StatusModule,
    LabelsModule,
    FeedbacksModule,
    PolesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
}
