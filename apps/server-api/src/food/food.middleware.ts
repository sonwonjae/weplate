import {
  ForbiddenException,
  HttpException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { RequestWithUserInfo } from 'src/auth/auth.middleware';

import { FoodService } from './food.service';

@Injectable()
export class CheckFoodAlreadyRegistUser implements NestMiddleware {
  constructor(private readonly foodService: FoodService) {}

  async use(req: RequestWithUserInfo, _: Response, next: NextFunction) {
    if (!req.userInfo) {
      return next();
    }

    const assembleId = req.params.assembleId as string;
    if (!req.userInfo) {
      throw new ForbiddenException();
    }

    const isRegistedUser = await this.foodService.checkAlreadyRegistUser(
      req.userInfo,
      {
        assembleId,
      },
    );

    if (isRegistedUser) {
      // FIXME: 아예 별도의 Exciption으로 생성할지 고민 필요
      throw new HttpException('already regist food', 400);
    }
    return next();
  }
}
