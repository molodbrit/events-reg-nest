import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventType } from './events.entity';
import { EventRO } from './events.interface';
import { AddEventDto, UpdateEventDto } from './dto';
import { DeleteResult } from 'typeorm';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('types')
  getEventTypes(): Promise<EventType[]> {
    return this.eventsService.getEventTypes();
  }

  @Get()
  getEvents(): Promise<Event[]> {
    return this.eventsService.getEvents();
  }

  @Post('add')
  addEvent(@Body() eventData: AddEventDto): Promise<EventRO> {
    return this.eventsService.addEvent(eventData);
  }

  @Put(':eventId')
  editEvent(
    @Param() params,
    @Body() eventData: UpdateEventDto,
  ): Promise<Event> {
    return this.eventsService.editEvent(params.eventId, eventData);
  }

  @Delete(':eventId')
  deleteEvent(@Param() params): Promise<DeleteResult> {
    return this.eventsService.deleteEvent(params.eventId);
  }
}
