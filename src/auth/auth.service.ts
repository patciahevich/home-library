import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { comparePassword } from 'src/utils/hash';

interface JwtPayload {
  userId: string;
  login: string;
}

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

    const { id, login } = user;

    return this.getTokens({ userId: id, login });
  }

  getTokens(payload: JwtPayload) {
    const { userId, login, ...rest } = payload;

    if ('exp' in rest) {
      delete rest.exp;
    }

    return {
      accessToken: this.generateAccessToken({ userId, login }),
      refreshToken: this.generateRefreshToken({ userId, login }),
    };
  }

  generateAccessToken(payload: JwtPayload) {
    const secret = this.configService.get('JWT_SECRET_KEY');
    const expiresIn = this.configService.get('TOKEN_EXPIRE_TIME');

    return jwt.sign(payload, secret, { expiresIn });
  }

  generateRefreshToken(payload: JwtPayload) {
    const secret = this.configService.get('JWT_SECRET_REFRESH_KEY');
    const expiresIn = this.configService.get('TOKEN_REFRESH_EXPIRE_TIME');

    return jwt.sign(payload, secret, { expiresIn });
  }

  validateToken(token: string) {
    const secret = this.configService.get('JWT_SECRET_REFRESH_KEY');

    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch {
      return null;
    }
  }
}
