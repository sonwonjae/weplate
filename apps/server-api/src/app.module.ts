import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AgreeModule } from './agree/agree.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssembleModule } from './assemble/assemble.module';
import { AuthModule } from './auth/auth.module';
import { FoodModule } from './food/food.module';
import { PingModule } from './ping/ping.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    AssembleModule,
    AuthModule,
    FoodModule,
    AgreeModule,
    PingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
