import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { comparePassword } from 'src/utils/hash';

interface JwtPayload {
  id: string;
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

    return {
      accessToken: this.generateAccessToken(user.id, user.login),
      refreshToken: this.generateRefreshToken(user.id, user.login),
    };
  }

  generateAccessToken(id: string, login: string) {
    const payload = { id, login };

    const secret = this.configService.get('JWT_SECRET_KEY');
    const expiresIn = this.configService.get('TOKEN_EXPIRE_TIME');

    return jwt.sign(payload, secret, { expiresIn });
  }

  generateRefreshToken(id: string, login: string) {
    const payload = { id, login };

    const secret = this.configService.get('JWT_SECRET_REFRESH_KEY');
    const expiresIn = this.configService.get('TOKEN_REFRESH_EXPIRE_TIME');

    return jwt.sign(payload, secret, { expiresIn });
  }

  validateToken(token: string) {
    const secret = this.configService.get('JWT_SECRET_REFRESH_KEY');
    return jwt.verify(token, secret) as JwtPayload;
  }
}
