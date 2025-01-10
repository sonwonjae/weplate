import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Tables } from '@package/types';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.userInfo as Tables<'users'>;
  },
);
