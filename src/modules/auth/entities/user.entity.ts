// src/modules/auth/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinTable,
    ManyToMany,
    RelationCount,
  } from 'typeorm';
  import { Post } from '../../posts/entities/post.entity';
  import { Follow } from '../../follows/entities/follow.entity';
  import { Notification } from '../../notifications/entities/notification.entity';
  import { Exclude } from 'class-transformer';
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    username: string;
  
    @Column({ unique: true })
    email: string;
  
    @Exclude()
    @Column()
    password: string;
  
    @Column({ default: false })
    isActive: boolean;
  
    @Column({ nullable: true })
    verificationToken: string;
  
    @Column({ nullable: true })
    resetPasswordToken: string;
  
    @Column({ type: 'timestamp', nullable: true })
    resetPasswordExpires: Date;
    
    @Column({ nullable: true })
    resetPasswordCode: string;
    @Column('json', {
      nullable: true // Remove any default value here
    })
    roles: string[];
  
    @OneToMany(() => Post, (post) => post.author)
    posts: Post[];
    
    @OneToMany(() => Follow, (follow) => follow.follower)
    following: Follow[];
  
    @OneToMany(() => Follow, (follow) => follow.following)
    followers: Follow[];
    
    @RelationCount((user: User) => user.followers)
    numberFollowers: number;
    @ManyToMany(() => Post)
    @JoinTable()
    favorites: Post[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
    
    @Column({ nullable: true, length: 500 })
    bio: string;

    @Column({ default: 'Ham ăn', length: 30 })
    name: string;

    @Column({ nullable: true })
    avatar: string;
    @Column({ nullable: true })
    banner: string;
    @Column({ nullable: true })
    tokenFCM: string;

    @ManyToMany(() => Post)
    @JoinTable({
        name: 'user_viewed_posts',
        joinColumn: {
            name: 'userId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'postId', 
            referencedColumnName: 'id',
        },
    })
    viewedPosts: Post[];
    
  }
  