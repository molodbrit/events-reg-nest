import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  HttpCode,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from './clients.entity';
import { AddClientDto, CheckRegistrationDto, EditClientDto } from './dto';
import { EventsService } from 'src/events/events.service';
import { DeleteResult } from 'typeorm';
import { CommonResponse } from 'src/app.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';

@Controller('events/:eventId/clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly eventService: EventsService,
  ) {}

  @Get()
  getClients(
    @Param('eventId', ParseIntPipe) eventId: number,
  ): Promise<Client[]> {
    return this.clientsService.getClients(eventId);
  }

  @Get(':clientId')
  async getClient(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<Client> {
    const client = await this.clientsService.getClient(eventId, clientId);

    if (!client) {
      const _error = { status: 'error', message: 'Client is not found.' };
      throw new HttpException(_error, HttpStatus.NOT_FOUND);
    }
    return client;
  }

  @Post('check_registration')
  @HttpCode(200)
  async checkRegistration(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() clientData: CheckRegistrationDto,
  ): Promise<Client[]> {
    const client = await this.clientsService.getAbsentClientByCredentials(
      eventId,
      clientData,
    );

    if (!client.length) {
      const _error = { status: 'error', message: 'Client is not found.' };
      throw new HttpException(_error, HttpStatus.NOT_FOUND);
    }
    return client;
  }

  @Post('register')
  async addClient(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() clientData: AddClientDto,
  ) {
    const event = this.eventService.getEvent(eventId);
    if (!event) {
      const _error = { status: 'error', message: 'Event does not exist.' };
      throw new HttpException(_error, HttpStatus.BAD_REQUEST);
    }

    return this.clientsService.addClient({ eventId, ...clientData });
  }

  @Put(':clientId')
  async editClient(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() clientData: EditClientDto,
  ) {
    return this.clientsService.editClient(eventId, clientId, clientData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':clientId')
  async deleteEvent(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Param('clientId', ParseIntPipe) clientId: number,
  ): Promise<CommonResponse> {
    const result: DeleteResult = await this.clientsService.deleteClient(
      eventId,
      clientId,
    );

    if (result.affected === 0) {
      const _error = { status: 'error', message: 'Client not found.' };
      throw new HttpException(_error, HttpStatus.NOT_FOUND);
    }

    return { status: 'ok' };
  }
}
