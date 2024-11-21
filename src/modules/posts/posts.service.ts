// src/modules/posts/posts.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto, CreatePostDto, FullReponseCommentDto, FullReponsePostDto, LiteReponsePostDto, ReponseUserDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { User } from '../auth/entities/user.entity';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class PostsService {
  [x: string]: any;
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private mailerService: MailerService,
  ) {}

  async createPost(createPostDto: CreatePostDto, userId: number): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const post = this.postsRepository.create({
      ...createPostDto,
      author: user,
    });
    await this.postsRepository.save(post);
    return { message: 'Tạo bài viết thành công.', post: new FullReponsePostDto(post) };
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto, userId: number): Promise<any> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }
    if (post.author.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này.');
    }
    Object.assign(post, updatePostDto);
    await this.postsRepository.save(post);
    return { message: 'Chỉnh sửa bài viết thành công.', post: new FullReponsePostDto(post) };
  }

  async deletePost(postId: number, userId: number): Promise<any> {
    const post = await this.postsRepository.findOne({ where: { id: postId }, relations: ['author'] });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }
    if (post.author.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bài viết này.');
    }
    await this.postsRepository.remove(post);
    return { message: 'Xóa bài viết thành công.' };
  }

  async getPostById(postId: number): Promise<any> {
    const post = await this.postsRepository.findOne({
      where: { id: postId }
    });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }
    post.totalView += 1;
    await this.postsRepository.save(post);

    return new FullReponsePostDto(post);
  }
  async getPostByUserId(userID: number): Promise<any> {
    const post = await this.postsRepository.find({
      where: { author: { id: userID } }
    });
    return post.map(post => new FullReponsePostDto(post));
  }
  async getLikeByPostId(postId: number, page: number): Promise<any> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.likes', 'likes')
      .select(['post.id', 'likes.id', 'likes.username', 'likes.avatar', 'likes.name'])
      .where('post.id = :id', { id: postId })
      .getOne();
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }
    const likes = post.likes;
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    if (likes.length > itemsPerPage*page) {
      return {nextPage: "true", likes: likes.slice(startIndex, startIndex + itemsPerPage).map(like => new ReponseUserDto(like))};
    }
    else{
      return {nextPage: "false", likes: likes.slice(startIndex, startIndex + itemsPerPage).map(like => new ReponseUserDto(like))};
    }
  }
  async getComments(postId: number, page: number): Promise<any> {
    const comments = await this.commentsRepository.find({
      where: { post: { id: postId } }
    });

    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    if (comments.length > itemsPerPage*page) {
      return {nextPage: "true", comments: comments.slice(startIndex, startIndex + itemsPerPage).map(comment => new FullReponseCommentDto(comment))};
    }
    else{
      return {nextPage: "false", comments: comments.slice(startIndex, startIndex + itemsPerPage).map(comment => new FullReponseCommentDto(comment))};
    }
  }
  async likePost(postId: number, userId: number): Promise<any> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.likes', 'likes')
      .select(['post', 'likes.id'])
      .where('post.id = :id', { id: postId })
      .getOne();
    
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }
    
    if (post.likes.some((like) => like.id === userId)) {
      throw new BadRequestException('Bạn đã thích bài viết này trước đó.');
    }
    post.likes.push({ id: userId } as User);
    post.totalLike = post.likes.length;
  
    await this.postsRepository.save(post);
    return { message: 'Đã thích bài viết.', totalLike: post.totalLike };
  }

  async unlikePost(postId: number, userId: number): Promise<any> {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.likes', 'likes')
      .select(['post', 'likes.id'])
      .where('post.id = :id', { id: postId })
      .getOne();
  
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }
  
    const likeIndex = post.likes.findIndex((like) => like.id === userId);
    if (likeIndex === -1) {
      throw new BadRequestException('Bạn chưa thích bài viết này.');
    }
  
    post.likes.splice(likeIndex, 1);
    post.totalLike = post.likes.length;
  
    await this.postsRepository.save(post);
    return { message: 'Đã bỏ thích bài viết.', totalLike: post.totalLike };
  }
  
  async getNewfeeds(userId: number, limit: number): Promise<any> {
    const currentTime = new Date();
    const posts = await this.postsRepository.find();
    const scoredPosts = posts.map(post => {
      //const isFollow = this.followsService.isFollowing(userId, post.author.id) ? 1 : 0;
      //const isRead = this.usersService.hasReadPost(userId, post.id) ? 1 : 0;
      const isFollow = 0;
      const isRead = 0;
      const hoursAway = (currentTime.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60);

      const baseScore = (Math.sqrt(post.totalLike + post.totalComment + Math.sqrt(post.totalView)) *
        (1 + isFollow) *
        (1 - isRead * 0.9) +
        isFollow * 2) /
        Math.sqrt(hoursAway / 2 + 1);
      return { post, score: baseScore };
    });
    // Sắp xếp bài viết theo điểm giảm dần
    scoredPosts.sort((a, b) => b.score - a.score);
    
    return scoredPosts.slice(0, limit).map(sp => new LiteReponsePostDto(sp.post));
  } 
  
  async createComment(postId: number, createCommentDto: CreateCommentDto, userId: number): Promise<any> {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại.');
    }
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    try {
      const comment = this.commentsRepository.create({
        content: createCommentDto.content,
        post,
        user,
      });
      await this.commentsRepository.save(comment);
    } catch (error) {
      throw new BadRequestException('Không thể tạo bình luận: ' + error.message);
    }
    post.totalComment++;
    await this.postsRepository.save(post);
    return { message: 'Thêm bình luận thành công.'};
  }

  async deleteComment(commentId: number, userId: number): Promise<any> {
    const comment = await this.commentsRepository.findOne({ where: { id: commentId }, relations: ['user'] });
    if (!comment) {
      throw new NotFoundException('Bình luận không tồn tại.');
    }
    if (comment.user.id !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này.');
    }
    await this.commentsRepository.remove(comment);

    return { message: 'Xóa bình luận thành công.' };
  }

  
}
