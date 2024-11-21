// src/modules/posts/dtos/update-post.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { IngredientDto } from './create-post.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsUrl } from 'class-validator';

export class UpdatePostDto{
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Tiêu đề bài viết', example: 'Sườn xào chua ngọt' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Mô tả bài viết', example: 'Món sườn xào chua ngọt thơm ngon, dễ làm' })
  description: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: 'Thời gian nấu', example: '45 phút' })
  cookTime?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  @ApiPropertyOptional({ description: 'Danh sách nguyên liệu', example: [{ name: 'Sườn heo non', quantity: '500g' }, { name: 'Hành', quantity: '1 củ' }, { name: 'Cà chua', quantity: '2 quả' }] })
  ingredient?: IngredientDto[];

  @IsOptional()
  @IsArray()
  @ApiPropertyOptional({ description: 'Cách nấu', example: ['Sườn non rửa sạch, chặt miếng vừa ăn.','Ướp sườn với gia vị trong 30 phút','Pha nước sốt chua ngọt','Phi thơm hành, xào sườn rồi cho nguyên liệu vào'] })
  steps?: string[];

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({ description: 'Hình ảnh chính của món ăn', example: 'https://file.hstatic.net/200000610729/file/suon-3_022e54b9753f433ea8d5e2b7466b3484.jpg' })
  mainImage?: string;
}
