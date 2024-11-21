// src/modules/search/search.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { getPagination, getPagingData } from '../../common/utils/pagination.util';

@Injectable()
export class SearchService {
  constructor(private readonly postsService: PostsService) {}

  async searchPosts(queryParams: any): Promise<any> {
    const { query, cookTime, difficulty, rating, page, limit } = queryParams;
    if (!query) {
      throw new BadRequestException('Vui lòng cung cấp từ khóa tìm kiếm.');
    }
    const pagination = getPagination(queryParams);
    const results = await this.postsService.searchPosts({
      query,
      cookTime,
      difficulty,
      rating,
      ...pagination,
    });
    return getPagingData(results, pagination.page, pagination.limit);
  }

  async getSearchSuggestions(query: string): Promise<any> {
    if (!query) {
      throw new BadRequestException('Vui lòng cung cấp từ khóa để nhận gợi ý.');
    }
    const suggestions = await this.postsService.getSearchSuggestions(query);
    return { suggestions };
  }
}
