import { IsInt, IsNotEmpty, IsOptional, Length } from 'class-validator';

export class AddClientDto {
  @IsOptional()
  @IsInt()
  readonly eventId: number;

  @IsNotEmpty()
  @Length(1, 256)
  readonly firstName: string;

  @IsNotEmpty()
  @Length(1, 256)
  readonly lastName: string;

  @IsOptional()
  @Length(10, 10)
  readonly phone: string;

  @IsNotEmpty()
  @Length(1, 512)
  readonly company: string;

  @IsOptional()
  @Length(10, 12)
  readonly inn: string;

  @IsNotEmpty()
  @IsInt()
  readonly userId: number;
}
