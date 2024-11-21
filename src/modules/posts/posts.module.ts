// src/modules/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { MailerModule } from '../mailer/mailer.module';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, User]), // Add User here
    MailerModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
