// src/modules/notifications/notifications.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { MailerService } from '../mailer/mailer.service';
import { NotiDto, ReponseNotificationDto } from './dtos/notification.dto';
import * as admin from "firebase-admin";

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notificationsRepository: Repository<Notification>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private mailerService: MailerService,
  ) {}



  

  async updateSettings(userId: number, settings: any): Promise<any> {
    // Implement logic to update notification settings
    // This may involve updating user preferences in the database
    // For simplicity, assuming it's handled elsewhere
    return { message: 'Cài đặt thông báo đã được cập nhật.' };
  }


  async sendNoti(notiDto: NotiDto): Promise<any> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: notiDto.userId } });
      const token = user.tokenFCM;
      const title = notiDto.title;
      const body = notiDto.body;

      const response = await admin.messaging().send({
        token,
        notification: {
          title,
          body,
        },
        data : {
          data1 : "abc",
          data2 : "123"
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
  async sendNotification(type_noti: string, userId: number, title: string, body: string, data1?: string, data2?: string, data3?: string, data4?: string ) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      
      const token = user.tokenFCM;

      await admin.messaging().send({
        token,
        notification: {
          title,
          body,
          
        },
        data : {
          type: type_noti || "TYPE",
          data_1 : data1 || "DATA1",
          data_2 : data2 || "DATA2",
          data_3 : data3 || "DATA3",
          data_4 : data4 || "DATA4"
        }
      });
    } catch (error) {
      throw error;
    }
  } 
  async sendNotificationWithImage(userId: number, type_noti: string, relatedId: number, imageU: string, data1?: string, data2?: string, data3?: string) {
    try {
      let title = "Thông báo";
      let message = "Bạn có thông báo mới";
      let body = "Bạn có thông báo mới";
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if(!user){
        return;
      }

      if(type_noti == "NEW_FOLLOWER"){
        const noti = await this.notificationsRepository.findOne({
          where: { type: "NEW_FOLLOWER", user: { id: userId } },
        });
        title = `${data1}`;
        message = `${data1} và ${data2} người khác đã theo dõi bạn.`;
        body = `${data1} vừa theo dõi bạn.`;

        if(noti){
          const diff = ((new Date().getTime()) - noti.updatedAt.getTime())/1000;
          if(message == noti.message && diff<50) return;

          noti.message = message;
          noti.isRead = false;
          noti.relatedID = relatedId;
          noti.imageURL = imageU;
          noti.updatedAt = new Date();
          await this.notificationsRepository.save(noti);
        }
        else{
          const notification = this.notificationsRepository.create({
            user,
            type: type_noti,
            message: message,
            imageURL: imageU,
            relatedID: relatedId,
            isRead: false,
            updatedAt: new Date(),
          });
          await this.notificationsRepository.save(notification);
        }
      }

      if(type_noti == "NEW_POST_LIKE"){
        const noti = await this.notificationsRepository.findOne({
          where: { type: "NEW_POST_LIKE", user: { id: userId }, relatedID: relatedId },
        });
        title = `${data1}`;
        message = `${data1} và ${data2} người khác đã thích bài viết của bạn: ${data3}`;
        body = `${data1} vừa thích bài viết của bạn: ${data3}`;
        if(noti){
          

          const diff = ((new Date().getTime()) - noti.updatedAt.getTime())/1000;
          if(message == noti.message && diff<50) return;


          noti.message = message;
          noti.isRead = false;
          noti.relatedID = relatedId;
          noti.imageURL = imageU;
          noti.updatedAt = new Date();
          await this.notificationsRepository.save(noti);
        }
        else{
          const notification = this.notificationsRepository.create({
            user,
            type: type_noti,
            message: body,
            imageURL: imageU,
            relatedID: relatedId,
            isRead: false,
            updatedAt: new Date(),
          });
          await this.notificationsRepository.save(notification);
        }
      }
      if(type_noti == "NEW_POST_COMMENT"){
        const noti = await this.notificationsRepository.findOne({
          where: { type: "NEW_POST_COMMENT", user: { id: userId }, relatedID: relatedId },
        });
        title = `${data1}`;
        message = `${data1} và ${data2} người khác đã bình luận về bài viết của bạn: ${data3}`;
        body = `${data1} vừa bình luận bài viết của bạn: ${data3}`;
        if(noti){
          

          const diff = ((new Date().getTime()) - noti.updatedAt.getTime())/1000;
          if(message == noti.message && diff<50) return;

          noti.message = message;
          noti.isRead = false;
          noti.relatedID = relatedId;
          noti.imageURL = imageU;
          noti.updatedAt = new Date();
          await this.notificationsRepository.save(noti);
        }
        else{
          const notification = this.notificationsRepository.create({
            user,
            type: type_noti,
            message: body,
            imageURL: imageU,
            relatedID: relatedId,
            isRead: false,
            updatedAt: new Date(),
          });
          await this.notificationsRepository.save(notification);
        }
      }
      if(type_noti == "NEW_COMMENT_LIKE"){
        const noti = await this.notificationsRepository.findOne({
          where: { type: "NEW_COMMENT_LIKE", user: { id: userId }, relatedID: relatedId },
        });
        title = `${data1}`;
        message = `${data1} và ${data2} người khác đã thích bình luận của bạn: ${data3}`;
        body = `${data1} vừa thích bình luận của bạn: ${data3}`;
        if(noti){
          

          const diff = ((new Date().getTime()) - noti.updatedAt.getTime())/1000;
          if(message == noti.message && diff<50) return;

          noti.message = message;
          noti.isRead = false;
          noti.relatedID = relatedId;
          noti.imageURL = imageU;
          noti.updatedAt = new Date();
          await this.notificationsRepository.save(noti);
        }
        else{
          const notification = this.notificationsRepository.create({
            user,
            type: type_noti,
            message: body,
            imageURL: imageU,
            relatedID: relatedId,
            isRead: false,
            updatedAt: new Date(),
          });
          await this.notificationsRepository.save(notification);
        }
      }


      const token = user.tokenFCM;
      if(!user.tokenFCM || user.tokenFCM == "string"){ 
        return;
      }
      await admin.messaging().send({
        token,
        android: {
          notification: {
            title,
            body,
            imageUrl: imageU || "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Unicode_0x003F.svg/1200px-Unicode_0x003F.svg.png",
            icon: "ic_launcher",
          }
        },    
        data : {
          type: type_noti || "TYPE",
          relatedID : `${relatedId}` || "-1",
          data_1 : data1 || "DATA1",
          data_2 : data2 || "DATA2",
        }
      });
    } catch (error) {
      console.log(error);
      return;
    }
  }
  async getNotifications(userId: number, page: number): Promise<any> {
    const notifications = await this.notificationsRepository.find({
      where: { user: { id: userId } },
      order: { updatedAt: 'DESC' },
      skip: (page - 1) * 10,
      take: 11,
    });
    if (notifications.length > 10) {
      return {nextPage: true, notifications: notifications.map(noti =>new ReponseNotificationDto(noti))};
    }
    else{
      return {nextPage: false, notifications: notifications.map(noti => new ReponseNotificationDto(noti))};
    }
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
}
