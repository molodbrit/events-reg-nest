import { IsNotEmpty, IsInt, IsBoolean, Length } from 'class-validator';

export class EditEventDto {
  @IsNotEmpty()
  @IsInt()
  readonly eventTypeId: number;

  @IsNotEmpty()
  @Length(1, 256)
  readonly locality: string;

  @IsNotEmpty()
  @Length(1, 256)
  readonly eventDate: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly active: boolean;

  @IsNotEmpty()
  @IsInt()
  readonly userId: number;
}
