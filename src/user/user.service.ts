import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      return;
    }
    if (user.password === updatePasswordDto.oldPassword) {
      return await this.prisma.user.update({
        where: { id },
        data: {
          password: updatePasswordDto.newPassword,
          version: { increment: 1 },
        },
        select: {
          id: true,
          login: true,
          version: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } else {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async delete(id: string) {
    const user = await this.getById(id);

    if (user) {
      return await this.prisma.user.delete({ where: { id } });
    } else {
      return null;
    }
  }
}
