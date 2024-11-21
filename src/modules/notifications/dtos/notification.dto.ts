// src/modules/notifications/dtos/notification.dto.ts
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty({ description: 'ID của thông báo' })
  @Expose()
  id: number;

  @ApiProperty({ description: 'Loại thông báo' })
  @Expose()
  type: string;

  @ApiProperty({ description: 'Nội dung thông báo' })
  @Expose()
  message: string;

  @ApiProperty({ description: 'ID liên quan đến thông báo (ví dụ: recipeId, commentId, userId)' })
  @Expose()
  relatedId: number;

  @ApiProperty({ description: 'Trạng thái đã đọc của thông báo' })
  @Expose()
  isRead: boolean;

  @ApiProperty({ description: 'Ngày tạo thông báo' })
  @Expose()
  createdAt: Date;
}
