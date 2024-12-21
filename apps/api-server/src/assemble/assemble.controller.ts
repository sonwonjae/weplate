import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserInfo } from 'src/auth/auth.decorator';
import { Tables } from 'src/supabase/supabase.types';

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
}
