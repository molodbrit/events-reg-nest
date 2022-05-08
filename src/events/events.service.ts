import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Event, EventType } from './events.entity';
import { validate } from 'class-validator';
import { EventRO } from './events.interface';
import { AddEventDto, UpdateEventDto } from './dto';

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

  public getEvents(): Promise<Event[]> {
    return this.eventsRepository.find();
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
      const _errors = { username: 'Event is not valid.' };
      throw new HttpException(
        { message: 'Input data validation failed', _errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const savedUser = await this.eventsRepository.save(newEvent);
      return this.buildEventRO(savedUser);
    }
  }

  public async editEvent(
    id: number,
    { eventTypeId, locality, eventDate, active, userId }: UpdateEventDto,
  ): Promise<Event> {
    const toUpdate = await this.eventsRepository.findOne(id);
    const updated = Object.assign(toUpdate, {
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

  private buildEventRO(event: Event) {
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
