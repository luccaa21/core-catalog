import { Injectable } from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ManufacturersService {

  constructor(
      private readonly prisma: PrismaService
    ) { }

  async create(dto: CreateManufacturerDto) {
    return await this.prisma.manufacturer.create({
      data: {
        name: dto.name,
      }
    });
  }

  async getAll() {
    return await this.prisma.manufacturer.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  }

}
