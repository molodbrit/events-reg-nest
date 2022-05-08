export class UpdateEventDto {
  readonly eventTypeId: number;
  readonly locality: string;
  readonly eventDate: string;
  readonly active: boolean;
  readonly userId: number;
}
