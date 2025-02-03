import { Agent } from 'node:https';

import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import {
  OptionalAuthMiddleware,
  RequiredAuthMiddleware,
} from 'src/auth/auth.middleware';
import { SupabaseService } from 'src/supabase/supabase.service';

import { AssembleController } from './assemble.controller';
import {
  CheckAssembleMaximumMiddleware,
  CheckFullAssembleMiddleware,
} from './assemble.middleware';
import { AssembleService } from './assemble.service';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new Agent({
        rejectUnauthorized: process.env.MODE !== 'dev',
      }),
    }),
  ],
  controllers: [AssembleController],
  providers: [AssembleService, SupabaseService],
})
export class AssembleModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequiredAuthMiddleware, CheckAssembleMaximumMiddleware)
      .forRoutes({
        path: 'assemble/item',
        method: RequestMethod.POST,
      })
      .apply(OptionalAuthMiddleware)
      .forRoutes({
        path: 'assemble/check/within-creation-limit',
        method: RequestMethod.GET,
      })
      .apply(RequiredAuthMiddleware)
      .forRoutes({
        path: 'assemble/list/my',
        method: RequestMethod.GET,
      })
      .apply(OptionalAuthMiddleware)
      .forRoutes(
        {
          path: 'assemble/:assembleId/item',
          method: RequestMethod.GET,
        },
        {
          path: 'assemble/:assembleId/item',
          method: RequestMethod.PATCH,
        },
        {
          path: 'assemble/:assembleId/item',
          method: RequestMethod.DELETE,
        },
      )
      .apply(OptionalAuthMiddleware)
      .forRoutes({
        path: 'assemble/:assembleId/user/list',
        method: RequestMethod.GET,
      })
      .apply(OptionalAuthMiddleware)
      .forRoutes({
        path: 'assemble/:assembleId/check/full',
        method: RequestMethod.GET,
      })
      .apply(RequiredAuthMiddleware)
      .forRoutes({
        path: 'assemble/:assembleId/check/new-registed-food-member',
        method: RequestMethod.GET,
      })
      .apply(RequiredAuthMiddleware)
      .forRoutes({
        path: 'assemble/:assembleId/check/countdown',
        method: RequestMethod.GET,
      })
      .apply(RequiredAuthMiddleware, CheckFullAssembleMiddleware)
      .forRoutes({
        path: 'assemble/:assembleId/request/join',
        method: RequestMethod.GET,
      })
      .apply(RequiredAuthMiddleware)
      .forRoutes({
        path: 'assemble/exit/all',
        method: RequestMethod.DELETE,
      });
  }
}
