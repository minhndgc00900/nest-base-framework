import { ICreateEntityDto } from '@khanh.tran/nestjs-crud-base';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, validate } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { Posts } from '../entities/posts.entity';

export class UpdatePostsDto implements ICreateEntityDto<Posts> {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  constructor(data: UpdatePostsDto) {
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
