// src/modules/profiles/dtos/update-profile.dto.ts
import { IsOptional, IsString, IsPhoneNumber, IsUrl, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  @ApiPropertyOptional({ description: 'Bio cá nhân mới' })
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @ApiPropertyOptional({ description: 'Tên mới' })
  name?: string;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'URL avatar mới' })
  avatar?: string;
  
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'URL banner mới' })
  banner?: string;
}
