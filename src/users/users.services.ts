import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public getUser(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }
}
