import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { RequiredAuthMiddleware } from 'src/auth/auth.middleware';
import { SupabaseService } from 'src/supabase/supabase.service';

import { FoodController } from './food.controller';
import { FoodService } from './food.service';

@Module({
  imports: [HttpModule],
  controllers: [FoodController],
  providers: [FoodService, SupabaseService],
})
export class FoodModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequiredAuthMiddleware).forRoutes({
      path: 'food/search/list',
      method: RequestMethod.GET,
    });
  }
}
