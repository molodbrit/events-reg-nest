import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Event, EventType } from './events.entity';
import { validate } from 'class-validator';
import { EventRO } from './events.interface';
import { AddEventDto, EditEventDto } from './dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventType)
    private eventTypesRepository: Repository<EventType>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  public getEventTypes(): Promise<EventType[]> {
    return this.eventTypesRepository.find();
  }

  public getEventType(id: number): Promise<EventType> {
    return this.eventTypesRepository.findOne(id);
  }

  public getEvents(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  public getEvent(id: number): Promise<Event> {
    return this.eventsRepository.findOne(id);
  }

  public getEventByCredentials(
    event_type_id: number,
    locality: string,
    event_date: string,
  ): Promise<Event[]> {
    return this.eventsRepository.find({
      where: {
        event_type_id,
        locality,
        event_date,
      },
    });
  }

  public async addEvent({
    eventTypeId,
    locality,
    eventDate,
    userId,
  }: AddEventDto): Promise<EventRO> {
    const newEvent = new Event();
    newEvent.event_type_id = eventTypeId;
    newEvent.locality = locality;
    newEvent.event_date = eventDate;
    newEvent.updated_by_user_id = userId;

    const errors = await validate(newEvent);
    if (errors.length > 0) {
      throw new HttpException(
        { status: 'error', message: 'Insert data validation failed.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const savedUser = await this.eventsRepository.save(newEvent);
      return this.buildEventRO(savedUser);
    }
  }

  public async editEvent(
    id: number,
    { eventTypeId, locality, eventDate, active, userId }: EditEventDto,
  ): Promise<Event> {
    const eventToUpdate = await this.getEvent(id);
    if (!eventToUpdate) {
      throw new HttpException(
        { status: 'error', message: 'Event not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const updated = Object.assign(eventToUpdate, {
      event_type_id: eventTypeId,
      locality,
      event_date: eventDate,
      active,
      updated_by_user_id: userId,
    });
    return this.eventsRepository.save(updated);
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return this.eventsRepository.delete({ id });
  }

  private buildEventRO(event: Event): EventRO {
    const eventRO = {
      id: event.id,
      event_type_id: event.event_type_id,
      locality: event.locality,
      event_date: event.event_date,
      active: event.active,
    };

    return { event: eventRO };
  }
}
