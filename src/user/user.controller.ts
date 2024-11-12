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
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UuidGuard } from 'src/utils/uuid.guard';
// import { AuthGuard } from 'src/utils/auth.guard';

// @UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @Get(':id')
  @UseGuards(UuidGuard)
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(UuidGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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
  async deleteUser(@Param('id') id: string, @Res() res) {
    const isDeleted = await this.userService.delete(id);

    if (!isDeleted) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return res.status(204).json({ message: 'User deleted successfully' });
  }
}
