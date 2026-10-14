import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBuildDto } from './dto/create-build.dto';
import { AddBuildItemDto } from './dto/add-build-item-dto';

@Injectable()
export class BuildsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateBuildDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id: dto.profileId },
    });
    if (!profile) {
      throw new NotFoundException(`Perfil ${dto.profileId} não encontrado`);
    }

    return await this.prisma.build.create({
      data: {
        name: dto.name,
        maxBudgetCents: dto.maxBudgetCents,
        profileId: dto.profileId,
      },
    });
  }

  async addItem(buildId: number, dto: AddBuildItemDto) {
    const build = await this.prisma.build.findUnique({
      where: { id: buildId },
      include: { items: { include: { component: true } } },
    });
    if (!build) {
      throw new NotFoundException(`Build ${buildId} não encontrada`);
    }

    const component = await this.prisma.component.findUnique({
      where: { id: dto.componentId },
    });
    if (!component) {
      throw new NotFoundException(`Componente ${dto.componentId} não encontrado`);
    }

    const quantity = dto.quantity ?? 1;

    const currentTotal = build.items.reduce(
      (sum, i) => sum + i.component.priceCents * i.quantity,
      0,
    );
    const newTotal = currentTotal + component.priceCents * quantity;

    if (newTotal > build.maxBudgetCents) {
      throw new BadRequestException(
        `Item ultrapassa o orçamento da build: total ficaria em ${newTotal} centavos, limite é ${build.maxBudgetCents}`,
      );
    }

    return this.prisma.buildItem.create({
      data: { buildId, componentId: dto.componentId, quantity },
    });
  }

  async summary(id: number) {
    const build = await this.prisma.build.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            component: {
              select: {
                id: true,
                name: true,
                category: true,
                priceCents: true,
                powerWatts: true,
                manufacturer: { select: { name: true } },
              },
            },
          },
        },
      },
    });
    if (!build) {
      throw new NotFoundException(`Build ${id} não encontrada`);
    }

    const totalCents = build.items.reduce(
      (sum, i) => sum + i.component.priceCents * i.quantity,
      0,
    );
    const totalWatts = build.items.reduce(
      (sum, i) => sum + i.component.powerWatts * i.quantity,
      0,
    );

    return {
      name: build.name,
      totalCents,
      totalWatts,
      maxBudgetCents: build.maxBudgetCents,
      items: build.items.map((i) => ({
        componentId: i.component.id,
        name: i.component.name,
        category: i.component.category,
        manufacturer: i.component.manufacturer.name,
        unitPriceCents: i.component.priceCents,
        powerWatts: i.component.powerWatts,
        quantity: i.quantity,
        subtotalCents: i.component.priceCents * i.quantity,
      })),
    };
  }
}