import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CRUDBaseController } from '@khanh.tran/nestjs-crud-base';
import { PostsService } from '../services/posts.service';
import { CreatePostsDto, UpdatePostsDto, PostsViewDto } from '../dtos';
import { Posts } from '../entities/posts.entity';

@Controller('postss')
@ApiTags('Posts')
export class PostsController extends CRUDBaseController<Posts>(CreatePostsDto, UpdatePostsDto, PostsViewDto, Posts) {
  constructor(private readonly service: PostsService) {
    super(service);
  }
}
