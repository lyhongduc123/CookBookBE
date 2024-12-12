// src/modules/auth/controllers/auth.controller.ts
import { Controller, Post, Body, Get, Query, Req, Put, Param, Request as Request1, UseGuards, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto, TokenDto } from '../dtos/login.dto';
import { ResetPassword1Dto, ResetPassword2Dto } from '../dtos/reset-password.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ForgotDto } from '../dtos/forgot.dto';
import { Request as Request2 } from 'express';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { GetRecipeDto } from '../dtos/aichef.dto';

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
    try {
      return this.authService.login(loginDto);
    }
    catch (error) {
      console.log(error);
      throw error;
    }
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
  @ApiResponse({ status: 200, description: 'Gửi code đến mail' })
  @ApiResponse({ status: 400, description: 'Email không hợp lệ' })
  forgotPassword(@Body() forgotDto: ForgotDto) {
    return this.authService.forgotPassword(forgotDto );
  }

  @Post('auth/reset-password-code')
  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Đặt lại mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ hoặc đã hết hạn' })
  resetPasswordCode(@Body() resetPassword1Dto: ResetPassword1Dto) {
    return this.authService.resetPasswordCode(resetPassword1Dto);
  }
  @Post('auth/reset-password')
  @ApiOperation({ summary: 'Đặt lại mật khẩu' })
  @ApiResponse({ status: 200, description: 'Đặt lại mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Token không hợp lệ hoặc đã hết hạn' })
  resetPassword(@Body() resetPassword2Dto: ResetPassword2Dto) {
    return this.authService.resetPassword(resetPassword2Dto);
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
  @Get('auth/logout')
  @ApiOperation({ summary: 'Đăng xuất' })
  logout(@Request1() req) {
    return this.authService.logout(req.user.id);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('auth/set-token')
  @ApiOperation({ summary: 'Set tokenFCM' })
  setTokenFCM(@Request1() req, @Body() tokenDto: TokenDto) {
    return this.authService.setTokenFCM(tokenDto, req.user.id);
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

  @Delete('favorite/check/:recipeId/:userId')
  @ApiOperation({ summary: 'Kiểm tra userId đã favorite recipeId chưa' })
  checkFavorite(@Param('recipeId') postId: number, @Param('userId') userId: number) {
    return this.authService.checkFavorite(postId, userId);
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
  @Get('search/username/:username/:page')
  @ApiOperation({ summary: 'Tìm kiếm người dùng theo username' })
  @ApiResponse({ status: 200, description: 'Tìm kiếm thành công' })
  @ApiResponse({ status: 404, description: 'Err' })
  async searchUserByUsername(@Param('username') username: string, @Param('page') page: number) {
    return this.authService.searchUserByUsername(username, page);
  }
  @Get('search/name/:name/:page')
  @ApiOperation({ summary: 'Tìm kiếm người dùng theo name' })
  @ApiResponse({ status: 200, description: 'Thông tin hồ sơ người dùng' })
  @ApiResponse({ status: 404, description: 'Err' })
  async searchUserByName(@Param('name') name: string, @Param('page') page: number) {
    return this.authService.searchUserByName(name, page);
  }
  
  /*
  @Post('profile/uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Đăng ảnh' })
  @ApiResponse({ status: 200, description: 'Đăng ảnh thành công' })
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.authService.uploadImage(file);
  }
}
*/
  @Post('uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(), 
      limits: { fileSize: 5 * 1024 * 1024 }, 
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return await this.authService.uploadImage(file.buffer);
  }
  

  @Post('airecipe/uploadImage')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(), 
      limits: { fileSize: 5 * 1024 * 1024 }, 
    }),
  )
  async sendImageToAI(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }
    return await this.authService.sendImageToAI(file.buffer);
  }
  @Post('airecipe/getRecipe')
  @ApiOperation({ summary: 'Gen công thức nấu ăn' })
  async getRecipesByIngredients(@Body() getRecipeDto: GetRecipeDto) {
    return await this.authService.getRecipesByIngredients(getRecipeDto);
  }
  
}