import { ICreateEntityDto } from '@khanh.tran/nestjs-crud-base';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, validate } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Posts } from '../entities/posts.entity';

export class CreatePostsDto implements ICreateEntityDto<Posts> {
  @ApiProperty()
  @IsNotEmpty()
  column_name: string;

  constructor(data: CreatePostsDto) {
    this.column_name = data.column_name;
  }

  async validate() {
    return validate(this);
  }

  mapToEntity(): DeepPartial<Posts> {
    return {
      column_name: this.column_name
    };
  }
}