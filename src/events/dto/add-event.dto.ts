import { IsInt, IsNotEmpty, Length } from 'class-validator';

export class AddEventDto {
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
  @IsInt()
  readonly userId: number;
}
