import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  getAll() {
    return this.databaseService.findAllUsers();
  }

  getById(id: string) {
    return this.databaseService.findUserById(id);
  }

  create(createUserDto: CreateUserDto) {
    return this.databaseService.createUser(createUserDto);
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    return this.databaseService.updateUserPassword(id, updatePasswordDto);
  }

  delete(id: string) {
    return this.databaseService.deleteUser(id);
  }
}
