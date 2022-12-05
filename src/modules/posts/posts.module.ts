import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { Posts } from './entities/posts.entity';
import { PostsRepository } from './repositories/posts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Posts])],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService],
})
export class PostsModule {}
