import { IsNotEmpty, Length } from 'class-validator';

export class CheckRegistrationDto {
  @IsNotEmpty()
  @Length(1, 256)
  readonly firstName: string;

  @IsNotEmpty()
  @Length(1, 256)
  readonly lastName: string;
}
