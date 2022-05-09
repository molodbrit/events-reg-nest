import {
  Controller,
  Post,
  Body,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserRO } from '../users/user.interface';
import { UsersService } from '../users/users.services';
import { JwtAuthGuard } from './jwt-auth.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginData: LoginDto): Promise<UserRO> {
    const { username, password } = loginData;

    const user = await this.usersService.getUserByName(username);
    if (!user) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Incorrect username.',
      });
    }
    if (user.password !== password) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Incorrect password.',
      });
    }
    if (user.active === false) {
      throw new UnauthorizedException({
        status: 'error',
        message: 'Inactive user.',
      });
    }

    return this.usersService.buildUserRO(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('status')
  getStatus() {
    return {
      status: 'ok',
    };
  }
}
