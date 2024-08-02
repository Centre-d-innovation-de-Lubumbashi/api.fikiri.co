import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { SolutionsModule } from './modules/solutions/solutions.module';
import { ThematicsModule } from './modules/thematics/thematics.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { CategoriesModule } from './modules/categories/categories.module';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EventsModule } from './modules/events/events.module';
import { FeedbacksModule } from './modules/feedbacks/feedbacks.module';
import { ImagesModule } from './modules/images/images.module';
import { OrganisationsModule } from './modules/organisations/organisations.module';
import { PolesModule } from './modules/poles/poles.module';
import { QuotationsModule } from './modules/quotations/quotations.module';
import { SolutionFeedbacksModule } from './modules/solution-feedbacks/solution-feedbacks.module';
import { StatusModule } from './modules/status/status.module';
import { DatabaseModule } from './shared/modules/database/database.module';
import { EmailModule } from './shared/modules/email/email.module';
import { SearchModule } from './shared/modules/search/search.module';
import { AuthGuard } from './modules/auth/guards/auth.guard';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..'),
      renderPath: '/uploads'
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    SolutionsModule,
    ThematicsModule,
    EventsModule,
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
    SolutionFeedbacksModule,
    CategoriesModule,
    SearchModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
