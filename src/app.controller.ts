import { Controller, Get } from '@nestjs/common';
import { CommonResponse } from './app.interface';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealthStatus(): CommonResponse {
    return this.appService.getHealthStatus();
  }
}
