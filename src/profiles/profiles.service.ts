import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ProfilesService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(dto: CreateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new BadRequestException('Usuário não existe.');
    }
    const existing = await this.prisma.profile.findUnique({
      where: {
        userId: dto.userId
      }
    });
    if (existing) {
      throw new ConflictException('Usuário já possui um perfil.');
    }
    await this.prisma.profile.create({
      data: {
        userId: dto.userId ?? 0,
        fullName: dto.fullName ?? '',
        birthDate: dto.birthDate ?? '',
        avatarUrl: dto.avatarUrl ?? ''
      }
    });
  }

  async getAll() {
    return await this.prisma.profile.findMany({
      select: { id: true, fullName: true, birthDate: true, createdAt: true },
      orderBy: { fullName: 'asc' },
    });;
  }

  async getOne(id: number) {
    const p = await this.prisma.profile.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Perfil não encontrado.');
    return {
      id: p.id,
      userId: p.userId,
      fullName: p.fullName,
      birthDate: p.birthDate?.toISOString(),
      avatarUrl: p.avatarUrl ?? '',
    };
  }

  async update(id: number, dto: UpdateProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { id }
    });
    if (!profile) throw new NotFoundException('Perfil não encontrado.');
    await this.prisma.profile.update({
      where: { id }, data: {
        birthDate: dto.birthDate,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
      }
    });
  }

  async remove(id: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { id }
    });
    if (!profile) throw new NotFoundException('Perfil não encontrado.');
    await this.prisma.profile.delete({
      where: { id }
    });
  }
}
