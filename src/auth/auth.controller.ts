import {
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserRO } from '../users/user.interface';
import { UsersService } from '../users/users.services';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<UserRO> {
    const { username, password } = loginData;

    const user = await this.usersService.getUserByName(username);
    if (!user) {
      const _error = { status: 'error', message: 'Incorrect username.' };
      throw new HttpException(_error, HttpStatus.UNAUTHORIZED);
    }
    if (user.password !== password) {
      const _error = { status: 'error', message: 'Incorrect password.' };
      throw new HttpException(_error, HttpStatus.UNAUTHORIZED);
    }
    if (user.active === false) {
      const _error = { status: 'error', message: 'Inactive user.' };
      throw new HttpException(_error, HttpStatus.UNAUTHORIZED);
    }

    return this.usersService.buildUserRO(user);
  }
}
