import { Agent } from 'node:https';

import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RequiredAuthMiddleware } from 'src/auth/auth.middleware';
import { SupabaseService } from 'src/supabase/supabase.service';

import { AgreeController } from './agree.controller';
import { AgreeService } from './agree.service';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new Agent({
        rejectUnauthorized: process.env.NEXT_PUBLIC_MODE !== 'dev',
      }),
    }),
    CacheModule.register(),
  ],
  controllers: [AgreeController],
  providers: [AgreeService, SupabaseService],
})
export class AgreeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequiredAuthMiddleware)
      .forRoutes({
        path: 'agree/service/policy',
        method: RequestMethod.POST,
      })
      .apply(RequiredAuthMiddleware)
      .forRoutes({
        path: 'agree/check/service/policy',
        method: RequestMethod.GET,
      });
  }
}
