import {
  Body,
  Param,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { Event, EventType } from './events.entity';
import { EventRO } from './events.interface';
import { AddEventDto, EditEventDto } from './dto';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { CommonResponse } from 'src/app.interface';

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

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addEvent(@Body() eventData: AddEventDto): Promise<EventRO> {
    const { eventTypeId, locality, eventDate } = eventData;

    const event = await this.eventsService.getEventByCredentials(
      eventTypeId,
      locality,
      eventDate,
    );
    if (event.length) {
      const _error = { status: 'error', message: 'Event already exists.' };
      throw new HttpException(_error, HttpStatus.CONFLICT);
    }

    const eventType = await this.eventsService.getEventType(eventTypeId);
    if (!eventType) {
      const _error = { status: 'error', message: 'Event type not found.' };
      throw new HttpException(_error, HttpStatus.BAD_REQUEST);
    }

    return this.eventsService.addEvent(eventData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':eventId')
  async editEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() eventData: EditEventDto,
  ): Promise<Event> {
    const { eventTypeId } = eventData;

    const eventType = await this.eventsService.getEventType(eventTypeId);
    if (!eventType) {
      const _error = { status: 'error', message: 'Event type not found.' };
      throw new HttpException(_error, HttpStatus.BAD_REQUEST);
    }

    return this.eventsService.editEvent(eventId, eventData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':eventId')
  async deleteEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<CommonResponse> {
    const result: DeleteResult = await this.eventsService.deleteEvent(eventId);

    if (result.affected === 0) {
      const _error = { status: 'error', message: 'Event not found.' };
      throw new HttpException(_error, HttpStatus.NOT_FOUND);
    }

    return { status: 'ok' };
  }
}
