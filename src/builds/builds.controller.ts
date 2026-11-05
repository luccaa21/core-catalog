import { Controller, Get, Post, Body, Param, ParseIntPipe, Req } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { AddBuildItemDto } from './dto/add-build-item-dto';

@Controller('builds')
export class BuildsController {
  constructor(private readonly buildsService: BuildsService) { }

  @Post()
  async create(@Body() dto: CreateBuildDto) {
    return this.buildsService.create(dto);
  }

  @Post(':id/items')
  async addItem(@Param('id', ParseIntPipe) id: number,
    @Body() dto: AddBuildItemDto) {
    return this.buildsService.addItem(id, dto);
  }

  @Get(':id/summary')
  summary(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { sub: number } },
  ) {
    return this.buildsService.summary(id, req.user.sub);
  }
}