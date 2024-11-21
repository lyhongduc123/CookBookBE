// src/modules/follows/controllers/follows.controller.ts
import { Controller, Post, Delete, Get, Param, UseGuards, Request } from '@nestjs/common';
import { FollowsService } from '../follows.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('follows')
@ApiBearerAuth()
@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':userId')
  @ApiOperation({ summary: 'Theo dõi người dùng khác' })
  @ApiResponse({ status: 200, description: 'Đã theo dõi người dùng' })
  @ApiResponse({ status: 400, description: 'Bạn đã theo dõi hoặc không thể theo dõi chính mình' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  followUser(@Param('userId') userId: number, @Request() req) {
    return this.followsService.followUser(userId, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  @ApiOperation({ summary: 'Hủy theo dõi người dùng' })
  @ApiResponse({ status: 200, description: 'Đã hủy theo dõi người dùng' })
  @ApiResponse({ status: 400, description: 'Bạn chưa theo dõi người dùng này' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  unfollowUser(@Param('userId') userId: number, @Request() req) {
    return this.followsService.unfollowUser(userId, req.user.id);
  }

  @Get('followers/:userId')
  @ApiOperation({ summary: 'Xem danh sách người theo dõi' })
  @ApiResponse({ status: 200, description: 'Danh sách người theo dõi' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  getFollowers(@Param('userId') userId: number) {
    return this.followsService.getFollowers(userId);
  }

  @Get('following/:userId')
  @ApiOperation({ summary: 'Xem danh sách đang theo dõi' })
  @ApiResponse({ status: 200, description: 'Danh sách đang theo dõi' })
  @ApiResponse({ status: 404, description: 'Người dùng không tồn tại' })
  getFollowing(@Param('userId') userId: number) {
    return this.followsService.getFollowing(userId);
  }
}
