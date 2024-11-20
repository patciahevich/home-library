import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { comparePassword } from 'src/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getUserByLogin(login: string) {
    return this.prisma.user.findFirst({ where: { login } });
  }

  async loginUser(user: User, loginData: CreateUserDto) {
    const isLogin = comparePassword(loginData.password, user.password);

    if (!isLogin) {
      return;
    }

    return this.generateAccessToken(user);
  }

  generateAccessToken(user: User) {
    const { id, login } = user;
    const payload = { id, login };

    const secret = this.configService.get('JWT_SECRET_KEY');
    const expiresIn = this.configService.get('TOKEN_EXPIRE_TIME');

    return jwt.sign(payload, secret, { expiresIn });
  }
}
