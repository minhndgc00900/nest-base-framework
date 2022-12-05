import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';

require('dotenv').config();

const env = process.env;

const slaves = [
  {
    host: env.DB_READ_HOST,
    port: Number(env.DB_READ_PORT),
    username: env.DB_READ_USER,
    password: env.DB_READ_PASS,
    database: env.DB_READ_NAME,
  },
];

const otherOptions: DataSourceOptions = {
  type: 'postgres',
  entities: [__dirname + '/entities/*.entity.{ts,js}'],
  logging: false,
  synchronize: false,
  migrationsRun: false,
  migrationsTransactionMode: 'each',
  migrations: [__dirname + '/migrations/*.{ts,js}'],
};

const masterDB: PostgresConnectionCredentialsOptions = {
  host: env.DB_WRITE_HOST,
  port: Number(env.DB_WRITE_PORT),
  username: env.DB_WRITE_USER,
  password: env.DB_WRITE_PASS,
  database: env.DB_WRITE_NAME,
};

const dataSource = new DataSource({
  ...masterDB,
  ...otherOptions,
});

describe('UserService Logic Test', () => {
  let connection: any;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    //   connection = await createMemoryDB([User]);
    //   console.log(dataSource)
    connection = await dataSource.initialize();
    userRepository = await connection.getRepository(User);
  });

  describe('Test Master DB Connection', () => {
    it('should return 1', async () => {
      const checkConnection = await userRepository.query('Select 1 as check');
      const result = [{ check: 1 }];
      expect(checkConnection).toStrictEqual(result);
      await connection.destroy();
    });
  });

  describe('Test Slaves DB Connection', () => {
    it('should return 1', async () => {
      const result = [{ check: 1 }];
      slaves.forEach(async slave => {
        const slvDatasource = new DataSource({
          ...slave,
          ...otherOptions,
        });
        const slvConnection = await slvDatasource.initialize();
        const repo = await slvConnection.getRepository(User);
        const checkConnection = await repo.query('Select 1 as check');
        expect(checkConnection).toStrictEqual(result);
        await slvConnection.destroy();
      });
    });
  });

  afterAll(async () => {
    await connection.destroy();
  });
});
