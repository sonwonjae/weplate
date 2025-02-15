import type { Response as ExpressResponse } from 'express';

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Redirect,
  Res,
} from '@nestjs/common';
import { Tables } from '@package/types';
import { UserInfo } from 'src/auth/auth.decorator';

import { AssembleService } from './assemble.service';
import { CreateAssembleDto } from './dto/create-assemble.dto';
import { GetAssembleInfinityListParamsDto } from './dto/get-assemble-infinity-list.dto';
import { UpdateAssembleDto } from './dto/update-assemble.dto';

@Controller('assemble')
export class AssembleController {
  constructor(private readonly assembleService: AssembleService) {}

  @Post('item')
  createAssemble(
    @Body() createAssembleDto: CreateAssembleDto,
    @UserInfo() userInfo: Tables<'users'>,
  ) {
    return this.assembleService.createAssemble(createAssembleDto, userInfo);
  }

  @Get('check/within-creation-limit')
  checkWithinCreationLimit(@UserInfo() userInfo: Tables<'users'>) {
    return this.assembleService.checkWithinCreationLimit(userInfo);
  }

  @Get('list/my')
  getAssembleList(
    @UserInfo() userInfo: Tables<'users'>,
    @Query() query: GetAssembleInfinityListParamsDto,
  ) {
    return this.assembleService.getMyAssembleList(userInfo, query);
  }

  @Get(':assembleId/item')
  getAssembleItem(@Param('assembleId') assembleId: string) {
    return this.assembleService.getAssembleItem(assembleId);
  }

  @Patch(':assembleId/item')
  update(
    @Param('assembleId') assembleId: string,
    @Body() updateAssembleDto: UpdateAssembleDto,
  ) {
    return this.assembleService.updateAssemble(assembleId, updateAssembleDto);
  }

  @Delete(':assembleId/item')
  remove(@Param('assembleId') assembleId: string) {
    return this.assembleService.removeAssemble(assembleId);
  }

  @Get(':assembleId/user/list')
  getAssembleUserList(
    @UserInfo() userInfo: Tables<'users'>,
    @Param('assembleId') assembleId: string,
  ) {
    return this.assembleService.getAssembleUserList(assembleId, userInfo);
  }

  @Get(':assembleId/check/full')
  checkFullAssemble(
    @Param('assembleId') assembleId: string,
    @UserInfo() userInfo?: Tables<'users'>,
  ) {
    return this.assembleService.checkJoinable(assembleId, userInfo);
  }

  @Get(':assembleId/request/join')
  @Redirect('/assemble/:assembleId')
  async requestJoinFromInvitee(
    @Param('assembleId') assembleId: string,
    @Res({ passthrough: true }) res: ExpressResponse,
    @UserInfo() userInfo: Tables<'users'>,
  ) {
    await this.assembleService.requestJoinFromInvitee(
      res,
      assembleId,
      userInfo,
    );

    return {
      url: `/assemble/${assembleId}`,
    };
  }

  @Get(':assembleId/check/new-registed-food-member')
  checkRegistedFoodMember(
    @UserInfo() userInfo: Tables<'users'>,
    @Param('assembleId') assembleId: string,
  ) {
    return this.assembleService.checkRegistedFoodMember(userInfo, assembleId);
  }

  @Get(':assembleId/check/countdown')
  countdownRecommendChance(@Param('assembleId') assembleId: string) {
    return this.assembleService.countdownRecommendChance(assembleId);
  }

  @Delete('exit/all')
  exitAllAssemble(@UserInfo() userInfo: Tables<'users'>) {
    return this.assembleService.exitAllAssemble(userInfo.id);
  }
}
