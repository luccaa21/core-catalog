import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {
    return this.prisma.profile.findMany({
      select: {
        id: true,
        userId: true,
        fullName: true,
        birthDate: true,
        avatarUrl: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { id: 'asc' },
    });
  }

  async create(dto: CreateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException(`Usuário ${dto.userId} não encontrado`);

    const exists = await this.prisma.profile.findUnique({ where: { userId: dto.userId } });
    if (exists) throw new ConflictException(`Usuário ${dto.userId} já possui perfil`);

    return this.prisma.profile.create({
      data: {
        userId: dto.userId,
        fullName: dto.fullName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        avatarUrl: dto.avatarUrl,
      },
    });
  }

  async update(id: number, dto: UpdateProfileDto) {
    await this.ensureExists(id);

    return this.prisma.profile.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
        avatarUrl: dto.avatarUrl,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    return this.prisma.profile.delete({ where: { id } });
  }

  private async ensureExists(id: number) {
    const profile = await this.prisma.profile.findUnique({ where: { id } });
    if (!profile) throw new NotFoundException(`Perfil ${id} não encontrado`);
  }
}