import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {AuthModule} from './auth/auth.module';
import {UsersModule} from './users/users.module';
import {RolesModule} from './roles/roles.module';
import {SolutionsModule} from './solutions/solutions.module';
import {ThematicsModule} from './thematics/thematics.module';
import {PrismaModule} from './database/prisma.module';
import {CallsModule} from './calls/calls.module';
import {ChallengesModule} from './challenges/challenges.module';
import {StatusModule} from './status/status.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { join } from 'path';

@Module({
    imports: [
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
        StatusModule
    ],
})
export class AppModule {
}
