import { Controller, Post, Body, Get } from '@nestjs/common';
import { Tables } from '@package/types';
import { UserInfo } from 'src/auth/auth.decorator';

import { AgreeService } from './agree.service';
import { AgreeServicePolicyDto } from './dto/create-agree.dto';

@Controller('agree')
export class AgreeController {
  constructor(private readonly agreeService: AgreeService) {}

  @Post('service/policy')
  agreeServicePolicy(
    @Body() agreeServicePolicyDto: AgreeServicePolicyDto,
    @UserInfo() userInfo: Tables<'users'>,
  ) {
    return this.agreeService.agreeServicePolicy(
      agreeServicePolicyDto,
      userInfo,
    );
  }

  @Get('check/service/policy')
  checkAgreeServicePolicy(@UserInfo() userInfo: Tables<'users'>) {
    return this.agreeService.checkAgreeServicePolicy(userInfo);
  }
}
