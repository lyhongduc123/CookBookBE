// src/modules/notifications/controllers/notifications.controller.ts
import { Controller, Get, Put, Delete, Param, UseGuards, Request, Body, Post } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotiDto } from '../dtos/notification.dto';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':page')
  @ApiOperation({ summary: 'Nhận thông báo' })
  @ApiResponse({ status: 200, description: 'Danh sách thông báo' })
  getNotifications(@Request() req, @Param('page') page: number) {
    try {
      return this.notificationsService.getNotifications(req.user.id, page);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('read/:notificationId')
  @ApiOperation({ summary: 'Đánh dấu thông báo đã đọc' })
  @ApiResponse({ status: 200, description: 'Đánh dấu thông báo là đã đọc' })
  @ApiResponse({ status: 404, description: 'Thông báo không tồn tại' })
  markAsRead(@Param('notificationId') notificationId: number, @Request() req) {
    return this.notificationsService.markAsRead(notificationId, req.user.id);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':notificationId')
  @ApiOperation({ summary: 'Xóa thông báo' })
  @ApiResponse({ status: 200, description: 'Đã xóa thông báo thành công' })
  @ApiResponse({ status: 404, description: 'Thông báo không tồn tại' })
  deleteNotification(@Param('notificationId') notificationId: number, @Request() req) {
    return this.notificationsService.deleteNotification(notificationId, req.user.id);
  }


}
