import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { CRUDBaseRepository } from '@khanh.tran/nestjs-crud-base';

@Injectable()
export class UserRepository extends CRUDBaseRepository<User>(User) {}
