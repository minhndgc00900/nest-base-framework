import { ICreateEntityDto } from '@khanh.tran/nestjs-crud-base';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, validate } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';

export class CreateUserDto implements ICreateEntityDto<User> {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  dob: string;

  constructor(data: CreateUserDto) {
    this.email = data.email;
    this.name = data.name;
    this.dob = data.dob;
  }

  async validate() {
    return validate(this);
  }

  mapToEntity(): DeepPartial<User> {
    return {
      email: this.email,
      name: this.name,
      dob: this.dob,
    };
  }
}

export class UserViewDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly dob: string;

  constructor(entity: User) {
    this.id = entity.uid;
    this.email = entity.email;
    this.name = entity.name;
    this.dob = entity.dob;
  }
}
