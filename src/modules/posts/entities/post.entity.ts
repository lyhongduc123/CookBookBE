// src/modules/posts/entities/post.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    RelationCount,
  } from 'typeorm';
  import { User } from '../../auth/entities/user.entity';
  import { Comment } from './comment.entity';
  
  @Entity()
  export class Post {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column('text')
    description: string;
  
    @Column({ nullable: true })
    cookTime: string;
  
    @Column({default: 0})
    @RelationCount((post: Post) => post.likes)
    totalLike: number;

    @Column({default: 0})
    @RelationCount((post: Post) => post.comments)
    totalComment: number;

    @Column({default: 0})
    totalView: number;

    @Column({default: 0})
    baseScore: number;

    @Column('simple-json', { nullable: true })
    ingredient: { 
      name: string; 
      quantity: string; 
    }[];
  
    @Column('simple-json', { nullable: true })
    steps: string[];
  
    @Column({ nullable: true })
    mainImage: string;
  
    @ManyToOne(() => User, (user) => user.posts, { eager: true })
    author: User;
    
    @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
    comments: Comment[];
  
    @ManyToMany(() => User)
    @JoinTable()
    likes: User[];
    
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

  }
  