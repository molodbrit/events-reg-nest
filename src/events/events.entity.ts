import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('event_types')
export class EventType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128 })
  name: string;
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  event_date: string;

  @Column({ type: 'varchar', length: 256 })
  locality: string;

  @Column({ type: 'boolean' })
  active: boolean;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;

  @Column({ type: 'integer' })
  event_type_id: number;

  @Column({ type: 'integer' })
  updated_by_user_id: number;
}
