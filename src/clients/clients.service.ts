import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { DeleteResult, Repository } from 'typeorm';
import { Client } from './clients.entity';
import { AddClientDto, CheckRegistrationDto, EditClientDto } from './dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClientData, ClientRO } from './clients.interface';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  public getClients(eventId: number): Promise<Client[]> {
    return this.clientRepository.find({
      where: {
        event_id: eventId,
      },
    });
  }

  public getClient(eventId: number, id: number): Promise<Client> {
    return this.clientRepository
      .find({
        where: {
          event_id: eventId,
          id,
        },
      })
      .then((r) => r[0]);
  }

  public getAbsentClientByCredentials(
    eventId: number,
    { firstName, lastName }: CheckRegistrationDto,
  ): Promise<Client[]> {
    return this.clientRepository.find({
      where: {
        event_id: eventId,
        first_name: firstName,
        last_name: lastName,
        visited: false,
      },
    });
  }

  public async addClient({
    eventId,
    firstName,
    lastName,
    phone,
    company,
    inn,
    userId,
  }: AddClientDto): Promise<ClientRO> {
    const newClient = new Client();
    newClient.event_id = eventId;
    newClient.first_name = firstName;
    newClient.last_name = lastName;
    newClient.phone = phone;
    newClient.company = company;
    newClient.inn = inn;
    newClient.updated_by_user_id = userId;
    newClient.visited = true;
    newClient.new_participant = true;

    const errors = await validate(newClient);
    if (errors.length > 0) {
      throw new HttpException(
        { status: 'error', message: 'Insert data validation failed.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      const savedClient = await this.clientRepository.save(newClient);
      return this.buildClientRO(savedClient);
    }
  }

  public async editClient(
    eventId: number,
    clientId: number,
    {
      firstName,
      lastName,
      phone,
      company,
      inn,
      visited,
      newParticipant,
      userId,
    }: EditClientDto,
  ): Promise<Client> {
    const clientToUpdate = await this.getClient(eventId, clientId);
    if (!clientToUpdate) {
      throw new HttpException(
        { status: 'error', message: 'Client not found' },
        HttpStatus.NOT_FOUND,
      );
    }
    const updated = Object.assign(clientToUpdate, {
      event_id: eventId,
      first_name: firstName,
      last_name: lastName,
      phone,
      company,
      inn,
      visited,
      new_participant: newParticipant,
      updated_by_user_id: userId,
    });
    return this.clientRepository.save(updated);
  }

  public async deleteClient(
    event_id: number,
    id: number,
  ): Promise<DeleteResult> {
    return this.clientRepository.delete({ event_id, id });
  }

  private buildClientRO(client: Client): ClientRO {
    const clientRO: ClientData = {
      id: client.id,
    };
    return { client: clientRO };
  }
}
