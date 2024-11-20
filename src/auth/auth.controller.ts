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

    return { accessToken: loginResponse };
  }
}
