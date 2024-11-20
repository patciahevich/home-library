import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const saltRounds = 10;

function hashPassword(password: string) {
  return bcrypt.hash(password, saltRounds);
}

function comparePassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

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
    const hash = await hashPassword(createUserDto.password);
    console.log(hash);
    return await this.prisma.user.create({
      data: { ...createUserDto, password: hash },
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

    const isCompare = comparePassword(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (isCompare) {
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
