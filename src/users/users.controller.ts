import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { User } from './users.entity';
import { UsersService } from './users.services';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':userId')
  async getUser(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    const user = await this.usersService.getUser(userId);
    if (!user) {
      const _error = { status: 'error', message: 'User not found.' };
      throw new HttpException(_error, HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
