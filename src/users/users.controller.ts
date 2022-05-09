import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { AddUserDto, EditUserDto } from './dto';
import { UserRO } from './user.interface';
import { User } from './users.entity';
import { UsersService } from './users.services';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async getUser(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    const user = await this.usersService.getUser(userId);
    if (!user) {
      const _error = { status: 'error', message: 'User not found.' };
      throw new HttpException(_error, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addUser(@Body() userData: AddUserDto): Promise<UserRO> {
    const { username } = userData;

    const user = await this.usersService.getUserByName(username);
    if (user) {
      const _error = { status: 'error', message: 'User already exists.' };
      throw new HttpException(_error, HttpStatus.CONFLICT);
    }

    return this.usersService.addUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  async editUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() userData: EditUserDto,
  ): Promise<User> {
    const user = await this.usersService.getUserByName(userData.username);
    if (user && user.id !== userId) {
      const _error = {
        status: 'error',
        message: 'User with this name already exists.',
      };
      throw new HttpException(_error, HttpStatus.CONFLICT);
    }

    return this.usersService.editUser(userId, userData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  deleteUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<DeleteResult> {
    return this.usersService.deleteUser(userId);
  }
}
