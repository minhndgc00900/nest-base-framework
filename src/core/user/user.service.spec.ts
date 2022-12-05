import { User } from './entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import UserRepository from './repositories/user.repository';

const r1 = {
  createdAt: null,
  updatedAt: null,
  tenantId: null,
  username: 'testuser1',
  fullName: 'test user',
  password: '123456',
};
const r2 = {
  createdAt: null,
  updatedAt: null,
  tenantId: null,
  username: 'testuser2',
  fullName: 'test user two',
  password: '123456',
};

const resultArr = [r1, r2];

describe('UserController', () => {
  let userController: UserController;
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserRepository,
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue(resultArr),
            create: jest.fn().mockReturnValue(r1),
            save: jest.fn().mockReturnValue(r1),
          },
        },
      ],
    }).compile();

    userController = app.get<UserController>(UserController);
    service = app.get<UserService>(UserService);
  });

  // describe('FindAll', () => {
  //   it('should return an array users infos', async () => {
  //     expect(await service.getAll()).toBe(resultArr);
  //   });
  // });

  describe('Create', () => {
    it('should return an object of user infos after create success', async () => {
      const createUsr = service.create(r1);
      expect(createUsr).resolves.toBe(r1);
    });
  });
});
