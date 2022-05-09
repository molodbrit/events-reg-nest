import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from '../users/users.entity';
import { UsersService } from '../users/users.services';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [UsersService],
})
export class AuthModule {}
