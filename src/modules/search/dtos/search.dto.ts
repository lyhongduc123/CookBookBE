// src/modules/search/dtos/search.dto.ts
import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDto {
  @IsString()
  @ApiProperty({ description: 'Từ khóa tìm kiếm' })
  query: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Thời gian nấu' })
  cookTime?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Độ khó' })
  difficulty?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Đánh giá' })
  rating?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Trang hiện tại' })
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ description: 'Số mục mỗi trang' })
  limit?: number;
}
