import { ICreateEntityDto } from '@khanh.tran/nestjs-crud-base';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, validate } from 'class-validator';
import { DeepPartial } from 'typeorm';
import { User } from '../entities/user.entity';

export class UpdateUserDto implements ICreateEntityDto<User> {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
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

  constructor(data: UpdateUserDto) {
    if (data.email) {
      this.email = data.email;
    }

    if (data.name) {
      this.name = data.name;
    }

    if (data.dob) {
      this.dob = data.dob;
    }
  }

  validate() {
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
