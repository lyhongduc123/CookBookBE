// src/app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiOperation({ summary: 'Giới thiệu về dự án' })
  @ApiResponse({ status: 200, description: 'Trả OK' })
  getHealth() {
    return this.appService.getProject()
  }
}
