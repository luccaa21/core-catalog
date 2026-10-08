import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')

export class ProfilesController {

  constructor(
    private readonly service: ProfilesService
  ) {}

  @Post()
  async create(@Body() dto: CreateProfileDto) {
    return await this.service.create(dto);
  }

  @Get()
  async getAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, 
               @Body() dto: UpdateProfileDto) {
    return await this.service.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.service.remove(id);
  }

}
