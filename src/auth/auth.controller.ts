import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    readonly authService: AuthService,
    readonly userService: UserService,
  ) {}

  @Post('/signup')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    if (!user) {
      throw new HttpException('This login is reserved', HttpStatus.CONFLICT);
    }

    return {
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    };
  }

  @Post('/login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() loginDto: CreateUserDto) {
    const user = await this.authService.getUserByLogin(loginDto.login);

    if (!user) {
      throw new HttpException('No user with such login', HttpStatus.FORBIDDEN);
    }

    const loginResponse = await this.authService.loginUser(user, loginDto);

    if (!loginResponse) {
      throw new HttpException(
        "Password doesn't match actual one",
        HttpStatus.FORBIDDEN,
      );
    }

    return { ...loginResponse };
  }

  @Post('/refresh')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async refreshToken(@Body() body: { token: string }) {
    const userData = this.authService.validateToken(body.token);

    if (!userData) {
      throw new HttpException('This token is invalid', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.authService.generateAccessToken(
      userData.id,
      userData.login,
    );

    return { accessToken };
  }
}
