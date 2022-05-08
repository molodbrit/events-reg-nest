export interface EventData {
  id: number;
  event_type_id: number;
  locality: string;
  event_date: string;
  active: boolean;
}

export interface EventRO {
  event: EventData;
}
