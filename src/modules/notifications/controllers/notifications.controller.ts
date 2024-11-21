// src/modules/notifications/controllers/notifications.controller.ts
import { Controller, Get, Put, Delete, Param, UseGuards, Request, Body } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Nhận thông báo' })
  @ApiResponse({ status: 200, description: 'Danh sách thông báo' })
  getNotifications(@Request() req) {
    return this.notificationsService.getNotifications(req.user.id);
  }

  @Put(':notificationId/read')
  @ApiOperation({ summary: 'Đánh dấu thông báo đã đọc' })
  @ApiResponse({ status: 200, description: 'Đánh dấu thông báo là đã đọc' })
  @ApiResponse({ status: 404, description: 'Thông báo không tồn tại' })
  markAsRead(@Param('notificationId') notificationId: number, @Request() req) {
    return this.notificationsService.markAsRead(notificationId, req.user.id);
  }

  @Delete(':notificationId')
  @ApiOperation({ summary: 'Xóa thông báo' })
  @ApiResponse({ status: 200, description: 'Đã xóa thông báo thành công' })
  @ApiResponse({ status: 404, description: 'Thông báo không tồn tại' })
  deleteNotification(@Param('notificationId') notificationId: number, @Request() req) {
    return this.notificationsService.deleteNotification(notificationId, req.user.id);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Cài đặt thông báo' })
  @ApiResponse({ status: 200, description: 'Cài đặt thông báo đã được cập nhật' })
  @ApiResponse({ status: 400, description: 'Cài đặt thông báo không hợp lệ' })
  updateSettings(@Body() settings: any, @Request() req) {
    return this.notificationsService.updateSettings(req.user.id, settings);
  }
}
