import { IsNotEmpty, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @Length(1, 128)
  username: string;

  @IsNotEmpty()
  @Length(1, 256)
  password: string;
}
