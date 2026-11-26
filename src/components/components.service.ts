import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';

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
        manufacturerId: true,
        manufacturer: { select: { name: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async update(id: number, dto: UpdateComponentDto) {
    await this.findOrFail(id);

    if (dto.manufacturerId !== undefined) {
      const manufacturer = await this.prisma.manufacturer.findUnique({
        where: { id: dto.manufacturerId },
      });
      if (!manufacturer) {
        throw new NotFoundException(`Fabricante ${dto.manufacturerId} não encontrado`);
      }
    }

    return this.prisma.component.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        name: true,
        category: true,
        priceCents: true,
        powerWatts: true,
        manufacturerId: true,
        manufacturer: { select: { name: true } },
      },
    });
  }

  async remove(id: number) {
    const component = await this.findOrFail(id);

    // O schema apagaria a peça das builds em cascata, mudando o total de quem já
    // montou uma build com ela. Por segurança, só exclui peça que não está em build.
    const builds = await this.prisma.buildItem.count({ where: { componentId: id } });
    if (builds > 0) {
      throw new ConflictException(
        `A peça "${component.name}" está em ${builds} item(ns) de build e não pode ser excluída.`,
      );
    }

    await this.prisma.component.delete({ where: { id } });
  }

  private async findOrFail(id: number) {
    const component = await this.prisma.component.findUnique({ where: { id } });
    if (!component) {
      throw new NotFoundException(`Peça ${id} não encontrada`);
    }
    return component;
  }
}