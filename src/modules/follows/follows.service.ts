// src/modules/follows/follows.service.ts
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(Follow) private followsRepository: Repository<Follow>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private notificationsService: NotificationsService,
  ) {}

  async followUser(targetUserId: number, currentUserId: number): Promise<any> {
    try {
      if (targetUserId == currentUserId) {
      throw new BadRequestException('Bạn không thể theo dõi chính mình.');
      }

      const targetUser = await this.usersRepository.findOne({ where: { id: targetUserId } });
      if (!targetUser) {
      throw new NotFoundException('Người dùng không tồn tại.');
      }

      const existingFollow = await this.followsRepository.findOne({
      where: { follower: { id: currentUserId }, following: { id: targetUserId } },
      });
      if (existingFollow) {
      throw new BadRequestException('Bạn đã theo dõi người dùng này trước đó.');
      }

      const follower = await this.usersRepository.findOne({ where: { id: currentUserId } });
      const follow = this.followsRepository.create({ follower, following: targetUser });
      await this.followsRepository.save(follow);
      return { message: 'Đã theo dõi người dùng.'};

    } catch (error) {
      throw error;
    }

    // Gửi thông báo đến người được theo dõi
    //await this.notificationsService.sendNotification(targetUserId, 'Bạn có người mới theo dõi.', follow.id, 'follow');

    
  }

  async unfollowUser(targetUserId: number, currentUserId: number): Promise<any> {
    const follow = await this.followsRepository.findOne({
      where: { follower: { id: currentUserId }, following: { id: targetUserId } },
    });
    if (!follow) {
      throw new BadRequestException('Bạn chưa theo dõi người dùng này.');
    }
    await this.followsRepository.remove(follow);
    return { message: 'Đã hủy theo dõi người dùng.'};
  }

  async getFollowers(userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['followers', 'followers.follower'],
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }
    const followers = user.followers.map((follow) => follow.follower);
    return { followers };
  }

  async getFollowing(userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['following', 'following.following'],
    });
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại.');
    }
    const following = user.following.map((follow) => follow.following);
    return { following };
  }
  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.followsRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    return !!follow;
  }
}
