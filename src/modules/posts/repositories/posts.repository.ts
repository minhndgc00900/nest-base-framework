import { Injectable } from '@nestjs/common';
import { Posts } from '../entities/posts.entity';
import { CRUDBaseRepository } from '@khanh.tran/nestjs-crud-base';

@Injectable()
export class PostsRepository extends CRUDBaseRepository<Posts>(Posts) {}
