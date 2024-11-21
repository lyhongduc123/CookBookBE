// src/modules/mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(private mailer: NestMailerService) {}

  async sendVerificationEmail(username: string, email: string, token: string, baseUrl: string): Promise<void> {
    const url = `${baseUrl}/auth/verify-email?token=${token}`;
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Xác thực Email',
        html: `
          <div style="font-family: 'Roboto', sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <div style="padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                <h1 style="color: #424242; margin: 0;">CookBook</h1>
                <h2 style="color: #424242; margin: 10px 0 0 0;">Xác thực Email</h2>
              </div>
              <div style="padding: 20px;">
                <p>Thân gửi <strong>${username}</strong>,</p>
                <p>Chúng tôi rất vui mừng khi bạn đã đăng ký tài khoản tại <strong>CookBook</strong>. Để hoàn tất quá trình đăng ký và bảo mật tài khoản của bạn, vui lòng xác thực địa chỉ email của bạn bằng cách nhấp vào nút dưới đây:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${url}" style="background-color: #1976d2; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-size: 16px; display: inline-block;">
                    Xác thực Email
                  </a>
                </div>
                <p>Nếu bạn không đăng ký tài khoản với email này, vui lòng bỏ qua mail.</p>
                <p>Trân trọng,<br/>CookBook - Admin</p>
              </div>
              <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 12px; color: #9e9e9e;">© 2024 CookBook. All rights reserved.</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw error;
    }
  }

  async sendResetPasswordEmail(name: string, email: string, code: string): Promise<void> {
    try {
      await this.mailer.sendMail({
        to: email,
        subject: 'Đặt lại mật khẩu',
        html: `
          <div style="font-family: 'Roboto', sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <div style="padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                <h1 style="color: #424242;">CookBook</h2>
                <h2 style="color: #424242;">Đặt Lại Mật Khẩu</h2>
              </div>
              <div style="padding: 20px;">
                <p>Thân gửi <strong>${name}</strong>,</p>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.<br/> Để đảm bảo an toàn, vui lòng không chia sẻ mã xác nhận cho ai.</p>
                <p>Mã xác nhận của bạn là:</p>
                <div style="background-color: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0; text-align: center;">
                  <span style="font-size: 24px; color: #1976d2; font-weight: bold;">${code}</span>
                </div>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <p>Trân trọng,<br/>CookBook - Admin</p>
              </div>
              <div style="padding: 20px; text-align: center; background-color: #f5f5f5; border-top: 1px solid #e0e0e0;">
                <p style="font-size: 12px; color: #9e9e9e;">© 2024 CookBook. All rights reserved.</p>
              </div>
            </div>
          </div>
        `,
      });
    } catch (error) {
      console.error('Failed to send reset email:', error);
      throw error;
    }
  }

  async sendLikeNotification(email: string, recipeTitle: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Bài viết của bạn đã được thích',
      template: 'like-notification', // Name of the template file (like-notification.hbs)
      context: {
        recipeTitle,
      },
    });
  }

  async sendUnlikeNotification(email: string, recipeTitle: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Bài viết của bạn đã bị bỏ thích',
      template: 'unlike-notification', // Name of the template file (unlike-notification.hbs)
      context: {
        recipeTitle,
      },
    });
  }

  async sendNotificationEmail(email: string, message: string): Promise<void> {
    await this.mailer.sendMail({
      to: email,
      subject: 'Thông báo mới',
      template: 'notification', // Name of the template file (notification.hbs)
      context: {
        message,
      },
    });
  }
}
