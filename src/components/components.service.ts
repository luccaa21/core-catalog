import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateComponentDto } from './dto/create-component.dto';

@Injectable()
export class ComponentsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateComponentDto) {
    const manufacturer = await this.prisma.manufacturer.findUnique({
      where: { id: dto.manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException(`Fabricante ${dto.manufacturerId} não encontrado`);
    }

    return this.prisma.component.create({
      data: dto,
    });
  }

  async findAll(category?: string) {
    return this.prisma.component.findMany({
      where: category ? { category } : undefined,
      select: {
        id: true,
        name: true,
        category: true,
        priceCents: true,
        powerWatts: true,
        manufacturer: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });
  }
}