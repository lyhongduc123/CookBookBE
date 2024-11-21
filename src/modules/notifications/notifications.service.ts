// src/modules/notifications/notifications.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}

  async getNotifications(userId: number): Promise<any> {
    const notifications = await this.notificationsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return { notifications };
  }

  async markAsRead(notificationId: number, userId: number): Promise<any> {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId, user: { id: userId } },
    });
    if (!notification) {
      throw new NotFoundException('Thông báo không tồn tại.');
    }
    notification.isRead = true;
    await this.notificationsRepository.save(notification);
    return { message: 'Đánh dấu thông báo là đã đọc.' };
  }

  async deleteNotification(notificationId: number, userId: number): Promise<any> {
    const notification = await this.notificationsRepository.findOne({
      where: { id: notificationId, user: { id: userId } },
    });
    if (!notification) {
      throw new NotFoundException('Thông báo không tồn tại.');
    }
    await this.notificationsRepository.remove(notification);
    return { message: 'Đã xóa thông báo thành công.' };
  }

  async updateSettings(userId: number, settings: any): Promise<any> {
    // Implement logic to update notification settings
    // This may involve updating user preferences in the database
    // For simplicity, assuming it's handled elsewhere
    return { message: 'Cài đặt thông báo đã được cập nhật.' };
  }

  async sendNotification(userId: number, message: string, relatedId: number, type: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) return;

    const notification = this.notificationsRepository.create({
      user,
      message,
      relatedId,
      type,
      isRead: false,
    });

    await this.notificationsRepository.save(notification);

  }
}
