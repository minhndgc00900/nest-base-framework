import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CRUDBaseController } from '@khanh.tran/nestjs-crud-base';
import { UserService } from '../services/user.service';
import { CreateUserDto, UpdateUserDto, UserViewDto } from '../dto';
import { User } from '../entities/user.entity';

@Controller('users')
@ApiTags('User')
export class UserController extends CRUDBaseController<User>(CreateUserDto, UpdateUserDto, UserViewDto, User) {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
