import { Injectable } from '@nestjs/common';
import { CRUDBaseService } from '@khanh.tran/nestjs-crud-base';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService extends CRUDBaseService<User>(UserRepository) {}
