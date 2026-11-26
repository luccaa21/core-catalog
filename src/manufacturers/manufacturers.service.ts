import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';
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

  async update(id: number, dto: UpdateManufacturerDto) {
    await this.findOrFail(id);

    try {
      return await this.prisma.manufacturer.update({
        where: { id },
        data: { name: dto.name.trim() },
        select: { id: true, name: true },
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new ConflictException(`Já existe um fabricante chamado "${dto.name.trim()}"`);
      }
      throw error;
    }
  }

  async remove(id: number) {
    const manufacturer = await this.findOrFail(id);

    const components = await this.prisma.component.count({
      where: { manufacturerId: id },
    });
    if (components > 0) {
      throw new ConflictException(
        `O fabricante "${manufacturer.name}" tem ${components} peça(s) cadastrada(s). Exclua ou mude as peças antes.`,
      );
    }

    await this.prisma.manufacturer.delete({ where: { id } });
  }

  private async findOrFail(id: number) {
    const manufacturer = await this.prisma.manufacturer.findUnique({ where: { id } });
    if (!manufacturer) {
      throw new NotFoundException(`Fabricante ${id} não encontrado`);
    }
    return manufacturer;
  }

}
