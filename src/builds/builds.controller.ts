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
  addItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddBuildItemDto,
    @Req() req: { user: { sub: number } },
  ) {
    return this.buildsService.addItem(id, dto, req.user.sub);
  }

  @Get(':id/summary')
  summary(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: { sub: number } },
  ) {
    return this.buildsService.summary(id, req.user.sub);
  }

  @Get('mine')
  findMine(@Req() req: { user: { sub: number } }) {
    return this.buildsService.findMine(req.user.sub);
  }
}