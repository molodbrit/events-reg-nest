import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('orders')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256 })
  first_name: string;

  @Column({ type: 'varchar', length: 256 })
  last_name: string;

  @Column({ type: 'varchar', length: 12 })
  phone?: string;

  @Column({ type: 'varchar', length: 512 })
  company: string;

  @Column({ type: 'varchar', length: 12 })
  inn?: string;

  @Column({ type: 'boolean' })
  visited: boolean;

  @Column({ type: 'boolean' })
  new_participant: boolean;

  @Column({ type: 'timestamp' })
  created_at: string;

  @Column({ type: 'timestamp' })
  updated_at: string;

  @Column({ type: 'integer' })
  event_id: number;

  @Column({ type: 'integer' })
  updated_by_user_id: number;
}
