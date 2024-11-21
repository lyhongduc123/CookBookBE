// src/modules/recipes/dtos/create-recipe.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, ValidateNested, IsUrl, ArrayMinSize, IsDate, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import exp from 'constants';
import { Post } from '../entities/post.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Comment } from '../entities/comment.entity';
export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Tên nguyên liệu', example: 'Thịt heo' })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Số lượng nguyên liệu', example: '500g' })
  quantity: string;
}
export class ReponseUserDto{
  constructor(user?: User) {
    if (user) {
        this.id = user.id;
        this.username = user.username;
        this.name = user.name;
        this.avatar = user.avatar;
    }
  }
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;
}
export class LiteReponsePostDto{
  constructor(post?: Post) {
    if (post) {
      this.id = post.id;
      this.author = new ReponseUserDto(post.author);
      this.title = post.title;
      this.description = post.description;
      this.cookTime = post.cookTime;
      this.mainImage = post.mainImage;
      this.totalView = post.totalView;
      this.totalComment = post.totalComment;
      this.totalLike = post.totalLike;
    }
  }
  @IsNotEmpty()
  id: number;

  @Type(() => ReponseUserDto)
  author: ReponseUserDto;

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
  @IsUrl()
  @ApiPropertyOptional({ description: 'Hình ảnh chính của món ăn', example: 'https://file.hstatic.net/200000610729/file/suon-3_022e54b9753f433ea8d5e2b7466b3484.jpg' })
  mainImage?: string;

  totalView?: number;
  totalFavorite?: number;
  totalComment?: number;
  totalLike?: number;
}

export class FullReponsePostDto{
  constructor(post?: Post) {
    if (post) {
      this.id = post.id;
      this.author = new ReponseUserDto(post.author);
      this.title = post.title;
      this.description = post.description;
      this.cookTime = post.cookTime;
      this.mainImage = post.mainImage;
      this.totalView = post.totalView;
      this.totalComment = post.totalComment;
      this.totalLike = post.totalLike;
      this.ingredient = post.ingredient;
      this.steps = post.steps;
    }
  }
  @IsNotEmpty()
  id: number;
  @Type(() => ReponseUserDto)
  author: ReponseUserDto;
  
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

  totalView?: number;
  totalFavorite?: number;
  totalComment?: number;
  totalLike?: number;

  
}
export class CreatePostDto {
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



export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty({ description: 'Nội dung bình luận' })
  content: string;
}

export class DeleteCommentDto {
  @IsNumber()
  @ApiProperty({ description: 'ID của bình luận cần xóa' })
  commentId: number;
}

export class FullReponseCommentDto{
  constructor(comment?: Comment) {
    if (comment) {
      this.id = comment.id;
      this.content = comment.content;
      this.user = new ReponseUserDto(comment.user);
      this.createdAt = comment.createdAt;
    }
  }
  nextPage: boolean;
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @Type(() => ReponseUserDto)
  user: ReponseUserDto;

  @IsDate()
  @IsNotEmpty()
  createdAt: Date

}
