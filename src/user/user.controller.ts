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
  getAllUsers() {
    return this.userService.getAll();
  }

  @Get(':id')
  @UseGuards(UuidGuard)
  getUserById(@Param('id') id: string) {
    const user = this.userService.getById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createUser(@Body() createUserDto: CreateUserDto) {
    if (!createUserDto.login || !createUserDto.password) {
      throw new HttpException(
        'Missing required fields',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(UuidGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateUserPassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const updatedUser = this.userService.updatePassword(id, updatePasswordDto);
    if (!updatedUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return updatedUser;
  }

  @Delete(':id')
  @UseGuards(UuidGuard)
  deleteUser(@Param('id') id: string, @Res() res) {
    const isDeleted = this.userService.delete(id);

    if (!isDeleted) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return res.status(204).json({ message: 'User deleted successfully' });
  }
}
