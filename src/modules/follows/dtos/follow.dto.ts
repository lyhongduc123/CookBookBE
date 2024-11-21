// src/modules/follows/dtos/follow.dto.ts
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowDto {
  @IsNumber()
  @ApiProperty({ description: 'ID của người dùng được theo dõi' })
  userId: number;
}
