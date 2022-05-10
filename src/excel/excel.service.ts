import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Workbook, Worksheet, Buffer } from 'exceljs';
import { Client } from 'src/clients/clients.entity';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class ExcelService {
  constructor(private readonly clientsService: ClientsService) {}

  public async export(eventId: number): Promise<Buffer> {
    const workbook: Workbook = this.createWorkbook();
    const worksheet: Worksheet = workbook.addWorksheet('orders');

    const clients: Client[] = await this.clientsService.getClients(eventId);
    if (!clients.length) {
      throw new HttpException(
        { status: 'error', message: 'No clients found.' },
        HttpStatus.NOT_FOUND,
      );
    }

    // add titles row
    const fieldNames: string[] = Object.getOwnPropertyNames(clients[0]);
    worksheet.addRow(fieldNames);

    // add data rows
    clients.forEach((client) => {
      worksheet.addRow(
        Object.values(client).map((value) => this.formatRowValue(value)),
      );
    });

    return workbook.xlsx.writeBuffer();
  }

  private createWorkbook(): Workbook {
    return new Workbook();
  }

  private formatRowValue(value: any): string {
    if (typeof value === 'boolean') {
      return value ? 'Да' : 'Нет';
    }
    return value ? String(value) : '—';
  }
}
