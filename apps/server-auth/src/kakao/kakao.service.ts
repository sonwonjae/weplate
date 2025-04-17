import type {
  OAuthTokenBody,
  OAuthTokenResponse,
  KakaoUserInfo,
} from './kakao.type';
import type { AxiosError } from 'axios';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class KakaoService {
  constructor(private readonly httpService: HttpService) {}
  async getKakaoUserInfoWithProviderId(providerId: string) {
    try {
      const { data: userInfo } = await firstValueFrom(
        this.httpService.post<KakaoUserInfo>(
          'https://kapi.kakao.com/v2/user/me',
          {
            target_id_type: 'user_id',
            target_id: providerId,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_APP_KEY}`,
            },
          },
        ),
      );
      return userInfo;
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async getUserInfoWithCode(code: string, redirectUrl: string) {
    try {
      const {
        data: { access_token: accessToken },
      } = await firstValueFrom(
        this.httpService
          .post<OAuthTokenResponse, OAuthTokenBody>(
            'https://kauth.kakao.com/oauth/token',
            {
              grant_type: 'authorization_code',
              client_id: process.env.KAKAO_REST_APP_KEY,
              redirect_uri: redirectUrl,
              code,
            },
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          )
          .pipe(
            catchError((error) => {
              throw error;
            }),
          ),
      );

      const { data: userInfo } = await firstValueFrom(
        this.httpService
          .post<KakaoUserInfo>(
            'https://kapi.kakao.com/v2/user/me',
            {},
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          )
          .pipe(
            catchError((error: AxiosError) => {
              throw error;
            }),
          ),
      );

      return {
        avatarUrl: '',
        email: userInfo?.kakao_account?.email ?? '',
        providerId: String(userInfo.id),
        gender: userInfo?.kakao_account?.gender ?? null,
        birthyear: Number(userInfo?.kakao_account?.birthyear ?? 0),
        provider: 'kakao',
      } as const;
    } catch (err) {
      const error = err as AxiosError;
      throw error as AxiosError;
    }
  }

  async logout(providerId: string) {
    try {
      return await firstValueFrom(
        this.httpService.post(
          'https://kapi.kakao.com/v1/user/logout',
          {
            target_id_type: 'user_id',
            target_id: providerId,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_APP_KEY}`,
            },
          },
        ),
      );
    } catch (error) {
      throw error as AxiosError;
    }
  }

  async quit(providerId: string) {
    try {
      return await firstValueFrom(
        this.httpService.post(
          'https://kapi.kakao.com/v1/user/unlink',
          {
            target_id_type: 'user_id',
            target_id: providerId,
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `KakaoAK ${process.env.KAKAO_ADMIN_APP_KEY}`,
            },
          },
        ),
      );
    } catch (error) {
      throw error as AxiosError;
    }
  }
}
