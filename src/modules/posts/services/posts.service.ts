import { Injectable } from '@nestjs/common';
import { CRUDBaseService } from '@khanh.tran/nestjs-crud-base';
import { Posts } from '../entities/posts.entity';
import { PostsRepository } from '../repositories/posts.repository';

@Injectable()
export class PostsService extends CRUDBaseService<Posts>(PostsRepository) {}
