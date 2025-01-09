import { Agent } from 'node:https';

import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AssembleService } from 'src/assemble/assemble.service';
import { SupabaseService } from 'src/supabase/supabase.service';

import { AuthController } from './auth.controller';
import { RequiredAuthMiddleware } from './auth.middleware';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new Agent({
        rejectUnauthorized: process.env.MODE !== 'dev',
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AssembleService, SupabaseService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequiredAuthMiddleware).forRoutes({
      path: 'auth/quit',
      method: RequestMethod.DELETE,
    });
  }
}
