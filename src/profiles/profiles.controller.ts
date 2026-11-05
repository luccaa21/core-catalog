import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateMyProfileDto } from './dto/create-my-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profilesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profilesService.remove(id);
  }

  @Get('me')
  findMine(@Req() req: { user: { sub: number } }) {
    return this.profilesService.findByUser(req.user.sub);
  }

  @Post('me')
  createMine(
    @Req() req: { user: { sub: number } },
    @Body() dto: CreateMyProfileDto,
  ) {
    return this.profilesService.create({ ...dto, userId: req.user.sub });
  }
}