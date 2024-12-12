// src/modules/posts/entities/comment.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinTable,
    ManyToMany,
    RelationCount,
  } from 'typeorm';
  import { Post } from './post.entity';
  import { User } from '../../auth/entities/user.entity';
  
  @Entity()
  export class Comment {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column('text')
    content: string;
  
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
    post: Post;
  
    @ManyToOne(() => User, (user) => user.id, { eager: true })
    user: User;
    
    @ManyToMany(() => User)
    @JoinTable()
    likes: User[];
    @Column({default: false})
    isLiked: boolean;
    @Column({default: 0})
    @RelationCount((comment: Comment) => comment.likes)
    totalLike: number;
    
    @CreateDateColumn()
    createdAt: Date;
  }
  
