import { IsNotEmpty } from 'class-validator';

export class AddEventDto {
  @IsNotEmpty()
  readonly eventTypeId: number;

  @IsNotEmpty()
  readonly locality: string;

  @IsNotEmpty()
  readonly eventDate: string;

  @IsNotEmpty()
  readonly userId: number;
}
