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
    if (targetUserId == currentUserId) {
    throw new BadRequestException('Bạn không thể theo dõi chính mình.');
    }

    const targetUser = await this.usersRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'followers')
      .where('user.id = :id', { id: targetUserId })
      .getOne();
    if (!targetUser) {
    throw new NotFoundException('Người dùng không tồn tại.');
    }

    const existingFollow = await this.followsRepository.findOne({
    where: { follower: { id: currentUserId }, following: { id: targetUserId } },
    });
    if (existingFollow) {
    throw new BadRequestException('Bạn đã theo dõi người dùng này trước đó.');
    }

    const follower = await this.usersRepository.findOne({ where: { id: currentUserId }});
    const follow = this.followsRepository.create({ follower, following: targetUser });
    await this.followsRepository.save(follow);
    await this.notificationsService.sendNotificationWithImage(targetUserId, "NEW_FOLLOWER", follower.id, follower.avatar, follower.name, `${targetUser.numberFollowers}`)
    return { message: 'Đã theo dõi người dùng.'};

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
  async checkFollow(followerId: number, followingId: number): Promise<any> {
    const follow = await this.followsRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (!follow) {
      return { isFollowed: false };
    }
    return { isFollowed: true };
  }
}
