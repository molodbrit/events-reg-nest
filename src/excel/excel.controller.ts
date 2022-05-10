import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Header,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guards';
import { ExcelService } from './excel.service';
import { Readable } from 'typeorm/platform/PlatformTools';
import { Buffer } from 'exceljs';

@UseGuards(JwtAuthGuard)
@Controller('events/:eventId/report')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('export')
  @Header(
    'Content-type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  )
  @Header('Content-disposition', 'attachment; filename=report.xlsx')
  async exportReport(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Res() res: Response,
  ): Promise<any> {
    let buffer;
    try {
      buffer = await this.excelService.export(eventId);
      if (!buffer) {
        throw new Error();
      }
    } catch (err: any) {
      throw new HttpException(
        { status: 'error', message: 'Report export failed.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const stream = this.createReadableStream(buffer);
    stream.pipe(res);
  }

  private createReadableStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}
