import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly service: UsersService) 
  {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    await this.service.create(body);
  }

  @Get()
  async findAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, 
               @Body() body: UpdateUserDto) {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
