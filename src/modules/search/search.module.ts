// src/modules/search/search.module.ts
import { Module } from '@nestjs/common';
import { SearchController } from './controllers/search.controller';
import { SearchService } from './search.service';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [PostsModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
