import { Injectable } from '@nestjs/common';
import { CommonResponse } from './app.interface';

@Injectable()
export class AppService {
  getHealthStatus(): CommonResponse {
    return { status: 'ok' };
  }
}
