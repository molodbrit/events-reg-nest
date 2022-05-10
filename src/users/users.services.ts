import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from './users.entity';
import { AddUserDto, EditUserDto } from './dto';
import { UserData, UserRO } from './users.interface';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  public getUsers(): Promise<User[]> {
    return this.usersRepository.find();
  }

  public getUser(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  public getUserByName(username: string): Promise<User> {
    return this.usersRepository
      .find({
        where: {
          username,
        },
      })
      .then((r) => r[0]);
  }

  public async addUser({ username, password }: AddUserDto): Promise<UserRO> {
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;

    const errors = await validate(newUser);
    if (errors.length > 0) {
      throw new HttpException(
        { status: 'error', message: 'Insert data validation failed.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const savedUser = await this.usersRepository.save(newUser);
      return this.buildUserRO(savedUser);
    }
  }

  public async editUser(
    id: number,
    { username, password, active }: EditUserDto,
  ): Promise<User> {
    const userToUpdate = await this.getUser(id);
    if (!userToUpdate) {
      throw new HttpException(
        { status: 'error', message: 'User not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const updated = Object.assign(userToUpdate, {
      username,
      password,
      active,
    });

    return this.usersRepository.save(updated);
  }

  public deleteUser(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete({ id });
  }

  public buildUserRO(user: User): UserRO {
    const userRO: UserData = {
      id: user.id,
      username: user.username,
      active: user.active,
      token: this.generateJWT(user),
    };

    return { user: userRO };
  }

  private generateJWT(user) {
    const SECRET = this.configService.get<string>('SECRET');
    return jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      SECRET,
      {
        expiresIn: '1d',
      },
    );
  }
}
