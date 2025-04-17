import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Tables } from '@package/types';
import { Request, Response, NextFunction } from 'express';
import { catchError, firstValueFrom } from 'rxjs';

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
            `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/api/user/auth/check`,
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
      throw new ForbiddenException();
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
            `${process.env.NEXT_PUBLIC_AUTH_BASE_URL}/api/user/auth/check`,
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
