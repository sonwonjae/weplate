import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { AssembleService } from './assemble.service';
import { CreateAssembleDto } from './dto/create-assemble.dto';
import { UpdateAssembleDto } from './dto/update-assemble.dto';

@Controller('assemble')
export class AssembleController {
  constructor(private readonly assembleService: AssembleService) {}

  @Post('item')
  createAssemble(@Body() createAssembleDto: CreateAssembleDto) {
    return this.assembleService.createAssemble(createAssembleDto);
  }

  // FIXME: auth check middleware 붙히기
  @Get('list/my')
  getAssembleList() {
    return this.assembleService.getMyAssembleList();
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
