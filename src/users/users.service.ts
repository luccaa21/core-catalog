import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async create(dto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        passwordHash: passwordHash
      }
    });
  }

  async getAll() {
    return await this.prisma.user.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      throw new NotFoundException(`Usuário ${id} não encontrado`);
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    await this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name ?? '',
        email: dto.email ?? ''
      }
    });
  }

  async remove(id: number) {
    await this.prisma.user.delete({
      where: { id }
    });
  }
}
