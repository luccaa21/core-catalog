import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { BuildsService } from './builds.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { AddBuildItemDto } from './dto/add-build-item-dto';

@Controller('builds')
export class BuildsController {
  constructor(private readonly buildsService: BuildsService) {}

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
  async summary(@Param('id', ParseIntPipe) id: number) {
    return this.buildsService.summary(id);
  }
}