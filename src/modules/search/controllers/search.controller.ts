// src/modules/search/controllers/search.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../search.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('recipes')
  @ApiOperation({ summary: 'Tìm kiếm bài viết' })
  @ApiResponse({ status: 200, description: 'Danh sách kết quả tìm kiếm' })
  @ApiResponse({ status: 400, description: 'Vui lòng cung cấp từ khóa tìm kiếm' })
  async searchPosts(@Query() query: any) {
    return this.searchService.searchPosts(query);
  }

  @Get('recipes/suggestions')
  @ApiOperation({ summary: 'Gợi ý tìm kiếm' })
  @ApiResponse({ status: 200, description: 'Danh sách gợi ý tìm kiếm' })
  @ApiResponse({ status: 400, description: 'Vui lòng cung cấp từ khóa để nhận gợi ý' })
  async getSearchSuggestions(@Query('query') query: string) {
    return this.searchService.getSearchSuggestions(query);
  }
}
