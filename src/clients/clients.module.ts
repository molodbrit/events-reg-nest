import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './clients.entity';
import { Event, EventType } from '../events/events.entity';
import { EventsService } from 'src/events/events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Event, EventType])],
  controllers: [ClientsController],
  providers: [ClientsService, EventsService],
})
export class ClientsModule {}
