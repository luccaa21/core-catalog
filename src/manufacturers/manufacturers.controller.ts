import { Controller, Get, Post, Body } from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private readonly manufacturersService: ManufacturersService) {}

  @Post()
  async create(@Body() dto: CreateManufacturerDto) {
    return this.manufacturersService.create(dto);
  }

  @Get()
  async getAll() {
    return this.manufacturersService.getAll();
  }

}
