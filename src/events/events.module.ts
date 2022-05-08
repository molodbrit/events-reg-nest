import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event, EventType } from './events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventType])],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
