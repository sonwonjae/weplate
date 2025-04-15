import { Agent } from 'node:https';

import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { KakaoService } from 'src/kakao/kakao.service';
import { SupabaseService } from 'src/supabase/supabase.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    HttpModule.register({
      httpsAgent: new Agent({
        rejectUnauthorized: process.env.NEXT_PUBLIC_MODE !== 'dev',
      }),
    }),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService, SupabaseService, KakaoService],
})
export class AuthModule {}
