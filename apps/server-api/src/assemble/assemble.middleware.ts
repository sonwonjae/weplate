import {
  ForbiddenException,
  HttpException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithUserInfo } from 'src/auth/auth.middleware';
import { SupabaseService } from 'src/supabase/supabase.service';

import { AssembleService } from './assemble.service';

/** FIXME: 기능은 정상동작하지만 해당 로직 auth 서버로 이전하기 */
@Injectable()
export class CheckAssemblePermissionMiddleware implements NestMiddleware {
  constructor(private readonly supabaseService: SupabaseService) {}

  async use(req: RequestWithUserInfo, _: Response, next: NextFunction) {
    const assembleId = req.params.assembleId as string;
    if (!req.userInfo) {
      throw new ForbiddenException();
    }

    const { data: userAssemble } = await this.supabaseService.client
      .from('user__assembles')
      .select('*')
      .eq('userId', req.userInfo.id)
      .eq('assembleId', assembleId)
      .single();

    if (!userAssemble) {
      throw new ForbiddenException();
    }
    return next();
  }
}

@Injectable()
export class CheckAssembleMaximumMiddleware implements NestMiddleware {
  constructor(private readonly assembleService: AssembleService) {}

  async use(req: RequestWithUserInfo, _: Response, next: NextFunction) {
    if (!req.userInfo) {
      return next();
    }

    const { isWithinCreationLimit } =
      await this.assembleService.checkWithinCreationLimit(req.userInfo);

    if (!isWithinCreationLimit) {
      // FIXME: 아예 별도의 Exciption으로 생성할지 고민 필요
      throw new HttpException('over assemble', 400);
    }
    return next();
  }
}

@Injectable()
export class CheckFullAssembleMiddleware implements NestMiddleware {
  constructor(private readonly assembleService: AssembleService) {}

  async use(req: RequestWithUserInfo, res: Response, next: NextFunction) {
    if (!req.userInfo) {
      return res.redirect(`/login?redirectUrl=${req.url}`);
    }
    const assembleId = req.params.assembleId as string;

    const { joinable, message } = await this.assembleService.checkJoinable(
      assembleId,
      req.userInfo,
    );

    if (!joinable) {
      if (message === 'full assemble') {
        return res.redirect(`/assemble/${assembleId}/invitee-room/full-member`);
      } else {
        return res.redirect(`/assemble/${assembleId}/invitee-room`);
      }
    }
    return next();
  }
}
