import { IsNotEmpty, IsBoolean, Length } from 'class-validator';

export class EditUserDto {
  @IsNotEmpty()
  @Length(1, 128)
  readonly username: string;

  @IsNotEmpty()
  @Length(1, 256)
  readonly password: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly active: boolean;
}
