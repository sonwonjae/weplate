import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { catchError, firstValueFrom } from 'rxjs';
import { Tables } from 'src/supabase/supabase.types';

export interface RequestWithUserInfo extends Request {
  userInfo: Tables<'users'>;
}

@Injectable()
export class RequiredAuthMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  async use(req: RequestWithUserInfo, _: Response, next: NextFunction) {
    try {
      const { data: userInfo } = await firstValueFrom(
        this.httpService
          .get<Tables<'users'>>(
            `${process.env.AUTH_SERVER_HOST}/api/user/auth/check`,
            {
              headers: {
                // FIXME: 자동화 유틸 만들어서 공통화 또는 자동화 하기
                Cookie: Object.entries(req.cookies)
                  .map(([key, value]) => {
                    return `${key}=${value}`;
                  })
                  .join('; '),
              },
            },
          )
          .pipe(
            catchError((error) => {
              throw error;
            }),
          ),
      );

      req.userInfo = userInfo;
      return next();
    } catch (error) {
      throw error as HttpException;
    }
  }
}

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor(private readonly httpService: HttpService) {}

  async use(req: RequestWithUserInfo, _: Response, next: NextFunction) {
    try {
      const { data: userInfo } = await firstValueFrom(
        this.httpService
          .get<Tables<'users'>>(
            `${process.env.AUTH_SERVER_HOST}/api/user/auth/check`,
            {
              headers: {
                // FIXME: 자동화 유틸 만들어서 공통화 또는 자동화 하기
                Cookie: Object.entries(req.cookies)
                  .map(([key, value]) => {
                    return `${key}=${value}`;
                  })
                  .join('; '),
              },
            },
          )
          .pipe(
            catchError((error) => {
              throw error;
            }),
          ),
      );

      req.userInfo = userInfo;
      return next();
    } catch {
      return next();
    }
  }
}
