import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RequiredAuthMiddleware } from 'src/auth/auth.middleware';
import { SupabaseService } from 'src/supabase/supabase.service';

import { FoodController } from './food.controller';
import { CheckFoodAlreadyRegistUser } from './food.middleware';
import { FoodService } from './food.service';

@Module({
  imports: [HttpModule],
  controllers: [FoodController],
  providers: [FoodService, SupabaseService],
})
export class FoodModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequiredAuthMiddleware)
      .forRoutes(
        {
          path: 'food/search/list',
          method: RequestMethod.GET,
        },
        {
          path: 'food/:assembleId/survey',
          method: RequestMethod.GET,
        },
        {
          path: 'food/:assembleId/survey',
          method: RequestMethod.PATCH,
        },
        {
          path: 'food/:assembleId/check/survey/complete',
          method: RequestMethod.GET,
        },
        {
          path: 'food/:assembleId/recommend/food',
          method: RequestMethod.POST,
        },
        {
          path: 'food/:assembleId/recommend/result',
          method: RequestMethod.GET,
        },
      )
      .apply(RequiredAuthMiddleware, CheckFoodAlreadyRegistUser)
      .forRoutes({
        path: 'food/:assembleId/survey',
        method: RequestMethod.POST,
      });
  }
}
