import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { SolutionsModule } from './solutions/solutions.module';
import { ThematicsModule } from './thematics/thematics.module';
import { CallsModule } from './calls/calls.module';
import { ChallengesModule } from './challenges/challenges.module';
import { StatusModule } from './status/status.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { QuotationsModule } from './quotations/quotations.module';
import { FeedbacksModule } from './feedbacks/feedbacks.module';
import { PolesModule } from './poles/poles.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { EmailModule } from './email/email.module';
import { ImagesModule } from './images/images.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    SolutionsModule,
    ThematicsModule,
    CallsModule,
    ChallengesModule,
    StatusModule,
    QuotationsModule,
    FeedbacksModule,
    PolesModule,
    OrganisationsModule,
    DashboardModule,
    EmailModule,
    ImagesModule,
    DatabaseModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
}
