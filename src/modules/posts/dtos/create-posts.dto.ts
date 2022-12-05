import { ICreateEntityDto } from '@khanh.tran/nestjs-crud-base';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, validate } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Posts } from '../entities/posts.entity';

export class CreatePostsDto implements ICreateEntityDto<Posts> {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  constructor(data: CreatePostsDto) {
    this.title = data.title;
  }

  async validate() {
    return validate(this);
  }

  mapToEntity(): DeepPartial<Posts> {
    return {
      title: this.title,
    };
  }
}
