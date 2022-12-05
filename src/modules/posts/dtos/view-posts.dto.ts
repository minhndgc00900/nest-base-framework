import { Entity } from "typeorm";
import { Posts } from '../entities/posts.entity';

export class PostsViewDto {

  constructor(entity: Posts) {
    return {
      id: entity.uid,
      column_name: entity.column_name
    };
  }
}