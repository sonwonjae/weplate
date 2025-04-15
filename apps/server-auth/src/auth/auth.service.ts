import type {
  CookieOptions,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

import { Cache } from '@nestjs/cache-manager';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Tables } from '@package/types';
import { shuffle } from 'es-toolkit';
import { SupabaseService } from 'src/supabase/supabase.service';
import { v4 as uuidv4 } from 'uuid';

import { ADJECTIVE_LIST, FOOD_NAME_LIST } from './consts/nickname';
import { DeleteAuthDto } from './dto/delete-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly cacheManager: Cache,
  ) {}

  /** NOTE: READ token */
  getToken(req: ExpressRequest) {
    const accessToken: string | undefined =
      req.cookies[process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN_COOKIE_NAME as string];
    const refreshToken: string | undefined =
      req.cookies[process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_COOKIE_NAME as string];

    return {
      accessToken,
      refreshToken,
    };
  }

  /** NOTE: CEHCK token */
  async checkToken(req: ExpressRequest, res: ExpressResponse) {
    try {
      const { accessToken } = this.getToken(req);

      if (!accessToken) {
        return this.checkRefreshToken(req, res);
      }

      const userId = await (async () => {
        const cachedUserId = await this.cacheManager.get<string>(
          `${process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN_COOKIE_NAME as string}:${accessToken}`,
        );

        if (cachedUserId) {
          return cachedUserId;
        }

        const { data: authToken } = await this.supabaseService.client
          .from('auth_tokens')
          .select('*')
          .eq('accessToken', accessToken)
          .single();

        return authToken?.userId;
      })();

      if (!userId) {
        return this.checkRefreshToken(req, res);
      }

      return this.getUserWithUserId(userId);
    } catch {
      throw new ForbiddenException();
    }
  }

  /** NOTE: CEHCK refresh token */
  async checkRefreshToken(req: ExpressRequest, res: ExpressResponse) {
    const { refreshToken } = this.getToken(req);

    if (!refreshToken) {
      throw new ForbiddenException();
    }
    const { data: authToken } = await this.supabaseService.client
      .from('auth_tokens')
      .select('*')
      .eq('refreshToken', refreshToken)
      .single();

    if (!authToken) {
      throw new ForbiddenException();
    }

    return {
      setCookie: await this.issueToken(res, authToken.userId),
      ...(await this.getUserWithUserId(authToken.userId)),
    };
  }

  /** NOTE: CREATE token */
  async issueToken(res: ExpressResponse, userId: string) {
    const accessToken = uuidv4();
    const refreshToken = uuidv4();
    const accessTokenExpires = new Date(
      Date.now() + 1000 * 60 * 60 /** NOTE: 1시간 */,
    );
    const refreshTokenExpires = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7 * 2 /** NOTE: 2주 */,
    );

    const COMMON_COOKIE_OPTION: CookieOptions = {
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN as string,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    };
    const ACCESS_TOKEN_COOKIE_OPTION: CookieOptions = {
      ...COMMON_COOKIE_OPTION,
      expires: accessTokenExpires,
    };
    const REFRESH_TOKEN_COOKIE_OPTION: CookieOptions = {
      ...COMMON_COOKIE_OPTION,
      expires: refreshTokenExpires,
    };

    res.cookie(
      process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN_COOKIE_NAME as string,
      accessToken,
      ACCESS_TOKEN_COOKIE_OPTION,
    );
    res.cookie(
      process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_COOKIE_NAME as string,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTION,
    );

    await this.cacheManager.set(
      `${process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN_COOKIE_NAME as string}:${accessToken}`,
      userId,
      Number(accessTokenExpires) - Date.now(),
    );

    await this.supabaseService.client.from('auth_tokens').upsert(
      {
        userId,
        accessToken,
        accessTokenExpires: accessTokenExpires.toUTCString(),
        refreshToken,
        refreshTokenExpires: refreshTokenExpires.toUTCString(),
      },
      { onConflict: 'userId' },
    );

    return res.getHeader('Set-Cookie');
  }

  /** NOTE: DELETE token */
  async expireToken(req: ExpressRequest, res: ExpressResponse) {
    const { accessToken } = this.getToken(req);
    if (accessToken) {
      await this.cacheManager.del(
        `${process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN_COOKIE_NAME as string}:${accessToken}`,
      );
    }

    const EXPIRED_COOKIE_OPTION: CookieOptions = {
      domain: process.env.NEXT_PUBLIC_APP_DOMAIN as string,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
      expires: new Date(0),
    };
    res.cookie(
      process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN_COOKIE_NAME as string,
      '',
      EXPIRED_COOKIE_OPTION,
    );
    res.cookie(
      process.env.NEXT_PUBLIC_AUTH_REFRESH_TOKEN_COOKIE_NAME as string,
      '',
      EXPIRED_COOKIE_OPTION,
    );
  }

  /** NOTE: READ user with userId */
  async getUserWithUserId(userId: string) {
    const cachedUserInfo = await this.cacheManager.get<Tables<'users'>>(
      `auth:userId:${userId}`,
    );
    if (cachedUserInfo) {
      return cachedUserInfo;
    }

    const { data: userInfo } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userInfo) {
      throw new ForbiddenException();
    }

    await this.cacheManager.set(`auth:userId:${userId}`, userInfo, 1000 * 60);
    return userInfo;
  }

  /** NOTE: READ user with providerId */
  async getUserWithProviderId(providerId: string) {
    const cachedUserInfo = await this.cacheManager.get<Tables<'users'>>(
      `auth:providerId:${providerId}`,
    );
    if (cachedUserInfo) {
      return cachedUserInfo;
    }

    const { data: userInfo } = await this.supabaseService.client
      .from('users')
      .select('*')
      .eq('providerId', providerId)
      .single();

    await this.cacheManager.set(
      `auth:providerId:${providerId}`,
      userInfo,
      1000 * 60,
    );
    return userInfo;
  }

  makeNickname() {
    return [shuffle(ADJECTIVE_LIST)[0], shuffle(FOOD_NAME_LIST)[0]].join('');
  }

  /** NOTE: CREATE user with providerId */
  async registUserWithProviderId(
    providerId: string,
    newUserInfo: {
      readonly avatarUrl: Tables<'users'>['avatarUrl'];
      readonly email: Tables<'users'>['email'];
      readonly providerId: Tables<'users'>['providerId'];
      readonly gender: Tables<'users'>['gender'];
      readonly birthyear: Tables<'users'>['birthyear'];
      readonly provider: Tables<'users'>['provider'];
    },
  ) {
    const userInfo = await this.getUserWithProviderId(providerId);

    if (userInfo) {
      return userInfo;
    }

    const { data: addedUserInfo } = await this.supabaseService.client
      .from('users')
      .insert({
        ...newUserInfo,
        nickname: this.makeNickname(),
      })
      .select('*')
      .single();

    if (!addedUserInfo) {
      throw new ForbiddenException();
    }

    return addedUserInfo;
  }

  /** NOTE: UPDATE user */
  async updateUser(updatedUserInfo: Partial<Tables<'users'>>) {
    if (!updatedUserInfo?.id) {
      throw new ForbiddenException();
    }

    const { data: userInfo } = await this.supabaseService.client
      .from('users')
      .update({ ...updatedUserInfo })
      .eq('id', updatedUserInfo.id)
      .select('*')
      .single();

    if (!userInfo) {
      throw new ForbiddenException();
    }
    await this.cacheManager.del(`auth:userId:${userInfo.id}`);
    await this.cacheManager.del(`auth:providerId:${userInfo.providerId}`);

    return userInfo;
  }

  /** NOTE: DELETE user */
  async deleteUser(req: ExpressRequest, res: ExpressResponse, userId: string) {
    await this.expireToken(req, res);
    await this.cacheManager.del(`auth:userId:${userId}`);
    await this.supabaseService.client.from('users').delete().eq('id', userId);
  }

  async registQuitUserSurveyForm(
    userProviderId: string,
    quitUserSurveyForm: DeleteAuthDto,
  ) {
    await this.supabaseService.client
      .from('auth_quit_survey')
      .insert({
        userProviderId,
        reason: quitUserSurveyForm.reason,
        suggestion: quitUserSurveyForm.suggestion,
        createdAt: new Date().toISOString(),
      })
      .select('*');
  }
}
