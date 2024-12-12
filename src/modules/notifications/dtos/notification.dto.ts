// src/modules/notifications/dtos/notification.dto.ts
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Notification } from '../entities/notification.entity';
export class ReponseNotificationDto {
  constructor(notification: Notification) {
    this.id = notification.id;
    this.type = notification.type;
    this.message = notification.message;
    this.relatedId = notification.relatedID;
    this.isRead = notification.isRead;
    this.createdAt = notification.updatedAt;
    this.imageURL = notification.imageURL;
  }
  @ApiProperty({ description: 'ID của thông báo' })
  id: number;

  @ApiProperty({ description: 'Loại thông báo' })
  type: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  message: string;

  @ApiProperty({ description: 'ID liên quan đến thông báo (ví dụ: recipeId, commentId, userId)' })
  relatedId: number;

  @ApiProperty({ description: 'Trạng thái đã đọc của thông báo' })
  isRead: boolean;

  @ApiProperty({ description: 'Ngày tạo thông báo' })
  createdAt: Date;

  @ApiProperty({ description: 'URL hình ảnh' })
  @IsOptional()
  imageURL?: string;
}




export class NotiDto {
  @IsNumber()
  @ApiProperty({ description: 'ID của người dùng', example: 1 })
  userId: number;
  @IsString()
  @ApiProperty({ description: 'Tiêu đề thông báo', example: 'New Notification' })
  title: string;
  @IsString()
  @ApiProperty({ description: 'Nội dung thông báo', example: 'This is a new notification' })
  body: string;

}
export class DataFCM {
  
}