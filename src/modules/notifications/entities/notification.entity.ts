// src/modules/notifications/entities/notification.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // e.g., 'like', 'comment', 'follow'

  @Column()
  message: string;

  @Column()
  relatedId: number; // e.g., recipeId, commentId, userId

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
