// src/modules/auth/controllers/auth.controller.ts
import { Controller, Post, Body, Get, Query, Req, Put, Param, Request as Request1, UseGuards, Delete } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ForgotDto } from '../dtos/forgot.dto';
import { Request as Request2 } from 'express';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../dtos/change-password.dto';

@ApiTags('auth')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc đã tồn tại' })
  register(@Body() registerDto: RegisterDto, @Req() req: Request2) {
    const baseUrl = `${req.protocol}://${req.get('Host')}`;
    return this.authService.register(registerDto, baseUrl);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Đăng nhập' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công' })
  @ApiResponse({ status: 401, description: 'Sai tên đăng nhập hoặc mật khẩu' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('auth/verify-email')
  @ApiOperation({ summary: 'Xác thực Email' })
  @ApiResponse({ status: 200, description: 'Xác thực thành công' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ hoặc đã hết hạn' })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('auth/forgot-password')
  @ApiOperation({ summary: 'Quên mật khẩu' })
  @ApiResponse({ status: 200, description: 'Liên kết đặt lại mật khẩu đã được gửi nếu email tồn tại' })
  @ApiResponse({ status: 400, description: 'Email không hợp lệ' })
  forgotPassword(@Body() forgotDto: ForgotDto, @Req() req: Request2) {
    
    return this.authService.forgotPassword(forgotDto );
  }

  @Post('auth/reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Đặt lại mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ hoặc đã hết hạn' })
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('auth/change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu (khi đã đăng nhập)' })
  @ApiResponse({ status: 200, description: 'Đổi mật khẩu thành công' })
  changePassword(@Request1() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('favorite/:page')
  @ApiOperation({ summary: 'Xem danh sách thích bài viết theo trang (mỗi trang 10, bắt đầu từ trang 1), nextPage true là có trang tiếp theo' })
  @ApiResponse({ status: 200, description: 'Danh sách người thích bài viết' })
  @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
  getLikeByPostId(@Param('page') page: number, @Request1() req) {
    return this.authService.getFavorites(page, req.user.id);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('favorite/:recipeId')
  @ApiOperation({ summary: 'Thêm vào danh sách yêu thích' })
  @ApiResponse({ status: 201, description: 'Đã thêm vào danh sách yêu thích' })
  @ApiResponse({ status: 400, description: 'Bài viết đã được thêm trước đó' })
  @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
  addToFavorites(@Param('recipeId') postId: number, @Request1() req) {
    return this.authService.addToFavorites(postId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('favorite/:recipeId')
  @ApiOperation({ summary: 'Xóa khỏi danh sách yêu thích' })
  @ApiResponse({ status: 200, description: 'Đã xóa khỏi danh sách yêu thích' })
  @ApiResponse({ status: 404, description: 'Bài viết không nằm trong danh sách yêu thích' })
  deleteFromFavorites(@Param('recipeId') postId: number, @Request1() req) {
    return this.authService.deleteFromFavorites(postId, req.user.id);
  }

  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('profile/edit')
  @ApiOperation({ summary: 'Chỉnh sửa hồ sơ người dùng' })
  @ApiResponse({ status: 200, description: 'Cập nhật hồ sơ thành công' })
  async updateMyProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request1() req,
  ) {
    return this.authService.updateProfile(req.user.id, updateProfileDto);
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Xem hồ sơ của người dùng' })
  @ApiResponse({ status: 200, description: 'Thông tin hồ sơ người dùng' })
  @ApiResponse({ status: 404, description: 'Hồ sơ không tồn tại' })
  async getUserProfile(@Param('userId') userId: number) {
    return this.authService.getProfileByUserId(userId);
  }
  
}
