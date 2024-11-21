// src/modules/auth/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinTable,
    ManyToMany,
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


    @ManyToMany(() => Post)
    @JoinTable()
    favorites: Post[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
    
    @Column({ nullable: true, length: 500 })
    bio: string;

    @Column({ default: 'Tôi dại dột', length: 30 })
    name: string;

    @Column({ nullable: true })
    avatar: string;



  }
  