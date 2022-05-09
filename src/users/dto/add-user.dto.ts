import { IsNotEmpty, Length } from 'class-validator';

export class AddUserDto {
  @IsNotEmpty()
  @Length(1, 128)
  readonly username: string;

  @IsNotEmpty()
  @Length(1, 256)
  readonly password: string;
}
