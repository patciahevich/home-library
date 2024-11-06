import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  private users = new Map<
    string,
    { id: string; login: string; password: string }
  >();

  findAll() {
    return Array.from(this.users.values());
  }

  findById(id: string) {
    return this.users.get(id) || null;
  }

  create(createUserDto: CreateUserDto) {
    const id = uuid();
    const newUser = { id, ...createUserDto };
    this.users.set(id, newUser);
    return newUser;
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = this.users.get(id);
    if (!user) return null;

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException(
        'Old password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    user.password = updatePasswordDto.newPassword;
    this.users.set(id, user);
    return user;
  }

  delete(id: string) {
    return this.users.delete(id);
  }
}
