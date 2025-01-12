import type { Request as ExpressRequest } from 'express';

import { HttpService } from '@nestjs/axios';
import { Body, Controller, Delete, Req } from '@nestjs/common';
import { Tables } from '@package/types';
import { catchError, firstValueFrom } from 'rxjs';
import { AssembleService } from 'src/assemble/assemble.service';

import { UserInfo } from './auth.decorator';
import { AuthService } from './auth.service';
import { DeleteAuthDto } from './dto/delete-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly assembleService: AssembleService,
    private readonly httpService: HttpService,
  ) {}
  @Delete('quit')
  async quit(
    @Req() req: ExpressRequest,
    @Body() body: DeleteAuthDto,
    @UserInfo() userInfo: Tables<'users'>,
  ) {
    console.log('come in');
    await this.assembleService.exitAllAssemble(userInfo.id);
    await firstValueFrom(
      this.httpService
        .delete(`${process.env.HOST}/api/user/auth/quit`, {
          headers: {
            // FIXME: 자동화 유틸 만들어서 공통화 또는 자동화 하기
            Cookie: Object.entries(req.cookies)
              .map(([key, value]) => {
                return `${key}=${value}`;
              })
              .join('; '),
          },
          data: body,
        })
        .pipe(
          catchError((error) => {
            throw error;
          }),
        ),
    );
  }
}
