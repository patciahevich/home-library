import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UuidGuard } from 'src/utils/uuid.guard';
import { AuthGuard } from 'src/utils/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(UuidGuard)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = await this.userService.create(createUserDto);
    return { statusCode: HttpStatus.CREATED, data: newUser };
  }

  @Put(':id')
  @UseGuards(UuidGuard)
  async updateUserPassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const updatedUser = await this.userService.updatePassword(
      id,
      updatePasswordDto,
    );
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(UuidGuard)
  async deleteUser(@Param('id') id: string) {
    await this.userService.delete(id);
    return { statusCode: HttpStatus.NO_CONTENT };
  }
}
