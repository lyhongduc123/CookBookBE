// src/modules/posts/controllers/posts.controller.ts
import {
    Controller,
    Post,
    Body,
    UseGuards,
    Request,
    Get,
    Param,
    Put,
    Delete,
    Query,
  } from '@nestjs/common';
  import { PostsService } from '../posts.service';
  import { CreateCommentDto, CreatePostDto } from '../dtos/create-post.dto';
  import { UpdatePostDto } from '../dtos/update-post.dto';
  import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
  import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('posts')
  @Controller('')
  export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('profile/posts/:userId')
    @ApiOperation({ summary: 'Xem tất cả bài viết của một người' })
    @ApiResponse({ status: 200, description: 'Thông tin chi tiết của bài viết' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    getPostByUserId(@Param('userId') userId: number) {
      return this.postsService.getPostByUserId(userId);
    }
    @Get('search/all/:query')
    @ApiOperation({ summary: 'Tìm kiếm bài viết và người dùng' })
    @ApiResponse({ status: 200, description: 'Bài viết và Người dùng' })
    @ApiResponse({ status: 404, description: 'Err' })
    async searchAll(@Param('query') query: string) {
      return this.postsService.searchAll(query);
    }
    @Get('search/post/:post/:page')
    @ApiOperation({ summary: 'Tìm kiếm bài viết' })
    @ApiResponse({ status: 200, description: 'Bài viết' })
    @ApiResponse({ status: 404, description: 'Err' })
    async searchPost(@Param('post') query: string, @Param('page') page: number) {
      return this.postsService.searchPost(query, page);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('newsfeed/:limit')
    @ApiOperation({ summary: 'Lấy newsfeed theo limit' })
    @ApiResponse({ status: 200, description: 'Newsfeed' })
    @ApiResponse({ status: 404, description: 'Error' })
    async getNewsfeed(@Request() req, @Param('limit') limit: number) {
      const result = await this.postsService.getNewsfeed(req.user.id, limit);
      return result;
    }




    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('posts')
    @ApiOperation({ summary: 'Tạo bài viết mới' })
    @ApiResponse({ status: 201, description: 'Tạo bài viết thành công' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
    createPost(@Body() createPostDto: CreatePostDto, @Request() req) {
      return this.postsService.createPost(createPostDto, req.user.id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('posts/:postId')
    @ApiOperation({ summary: 'Chỉnh sửa bài viết' })
    @ApiResponse({ status: 200, description: 'Cập nhật bài viết thành công' })
    @ApiResponse({ status: 403, description: 'Không có quyền chỉnh sửa' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    updatePost(
      @Param('postId') postId: number,
      @Body() updatePostDto: UpdatePostDto,
      @Request() req,
    ) {
      return this.postsService.updatePost(postId, updatePostDto, req.user.id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('posts/:postId')
    @ApiOperation({ summary: 'Xóa bài viết' })
    @ApiResponse({ status: 200, description: 'Xóa bài viết thành công' })
    @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    deletePost(@Param('postId') postId: number, @Request() req) {
      return this.postsService.deletePost(postId, req.user.id);
    }

    @Get('like/check/:postId/:userId')
    @ApiOperation({ summary: 'Kiểm tra userId đã thích postId hay chưa' })
    checkLike(@Param('postId') postId: number, @Param('userId') userId: number) {
      return this.postsService.checkLike(postId, userId);
    }

    @Get('posts/:postId')
    @ApiOperation({ summary: 'Xem bài viết chi tiết' })
    @ApiResponse({ status: 200, description: 'Thông tin chi tiết của bài viết' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    getPostById(@Param('postId') postId: number) {
      return this.postsService.getPostById(postId);
    }
    
    @Get('like/:postId/:page')
    @ApiOperation({ summary: 'Xem danh sách thích bài viết theo trang (mỗi trang 10, bắt đầu từ trang 1), nextPage true là có trang tiếp theo' })
    @ApiResponse({ status: 200, description: 'Danh sách người thích bài viết' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    getLikeByPostId(@Param('postId') postId: number, @Param('page') page: number) {
      return this.postsService.getLikeByPostId(postId, page);
    }
    



    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('like/:postId')
    @ApiOperation({ summary: 'Thích bài viết' })
    @ApiResponse({ status: 200, description: 'Đã thích bài viết' })
    @ApiResponse({ status: 400, description: 'Đã thích bài viết này trước đó' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    likePost(@Param('postId') postId: number, @Request() req) {
      return this.postsService.likePost(postId, req.user.id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('like/:postId')
    @ApiOperation({ summary: 'Bỏ thích bài viết' })
    @ApiResponse({ status: 200, description: 'Đã bỏ thích bài viết' })
    @ApiResponse({ status: 400, description: 'Bạn chưa thích bài viết này' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    unlikePost(@Param('postId') postId: number, @Request() req) {
      return this.postsService.unlikePost(postId, req.user.id);
    }
    
    @Get('comment/:postId/:page')
    @ApiOperation({ summary: 'Xem bình luận' })
    @ApiResponse({ status: 200, description: 'Danh sách bình luận' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    getComments(@Param('postId') postId: number, @Param('page') page: number) {
      return this.postsService.getComments(postId, -1, page);
    }
    @Get('comment-with-like/:postId/:userId/:page')
    @ApiOperation({ summary: 'Xem bình luận' })
    @ApiResponse({ status: 200, description: 'Danh sách bình luận' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    getCommentsWithLike(@Param('postId') postId: number, @Param('userId') userId: number, @Param('page') page: number) {
      return this.postsService.getComments(postId, userId, page);
    }
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('comment/:postId')
    @ApiOperation({ summary: 'Thêm bình luận' })
    @ApiResponse({ status: 201, description: 'Thêm bình luận thành công' })
    @ApiResponse({ status: 400, description: 'Nội dung bình luận không hợp lệ' })
    @ApiResponse({ status: 404, description: 'Bài viết không tồn tại' })
    createComment(
      @Param('postId') postId: number,
      @Body() createCommentDto: CreateCommentDto,
      @Request() req,
    ) {
      return this.postsService.createComment(postId, createCommentDto, req.user.id);
    }
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('comment/:commentId')
    @ApiOperation({ summary: 'Xóa bình luận của mình' })
    @ApiResponse({ status: 200, description: 'Xóa bình luận thành công' })
    @ApiResponse({ status: 403, description: 'Không có quyền xóa' })
    @ApiResponse({ status: 404, description: 'Bình luận không tồn tại' })
    deleteComment(@Param('commentId') commentId: number, @Request() req) {
      return this.postsService.deleteComment(commentId, req.user.id);
    }
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('comment/:commentId')
    @ApiOperation({ summary: 'Chỉnh sửa bình luận' })
    @ApiResponse({ status: 200, description: 'Cập nhật bình luận thành công' })
    @ApiResponse({ status: 403, description: 'Không có quyền chỉnh sửa' })
    @ApiResponse({ status: 404, description: 'Bình luận không tồn tại' })
    updateComment(
      @Param('commentId') commentId: number,
      @Body() createCommentDto: CreateCommentDto,
      @Request() req,
    ) {
      return this.postsService.updateComment(commentId, createCommentDto, req.user.id);
    }
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post('comment/like/:commentId')
    @ApiOperation({ summary: 'Thích bình luận' })
    @ApiResponse({ status: 200, description: 'Đã thích bình luận' })
    @ApiResponse({ status: 400, description: 'Đã thích bình luận này trước đó' })
    @ApiResponse({ status: 404, description: 'Bình luận không tồn tại' })
    likeComment(@Param('commentId') commentId: number, @Request() req) {
      return this.postsService.likeComment(commentId, req.user.id);
    }
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('comment/like/:commentId')
    @ApiOperation({ summary: 'Bỏ thích bình luận' })
    @ApiResponse({ status: 200, description: 'Đã bỏ thích bình luận' })
    @ApiResponse({ status: 400, description: 'Bạn chưa thích bình luận này' })
    @ApiResponse({ status: 404, description: 'Bình luận không tồn tại' })
    unlikeComment(@Param('commentId') commentId: number, @Request() req) {
      return this.postsService.unlikeComment(commentId, req.user.id);
    }
    
    @Get('comment/like/check/:commentId/:userId')
    @ApiOperation({ summary: 'Kiểm tra userId đã thích commentId hay chưa' })
    @ApiResponse({ status: 200, description: 'Đã thích' })
    @ApiResponse({ status: 400, description: 'Chưa thích' })
    @ApiResponse({ status: 404, description: 'Comment không tồn tại' })
    checkLikeComment(@Param('commentId') commentId: number, @Param('userId') userId: number) {
      return this.postsService.checkLikeComment(commentId, userId);
    }
}
  