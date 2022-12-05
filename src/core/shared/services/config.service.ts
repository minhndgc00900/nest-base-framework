import * as dotenv from 'dotenv';
import * as Joi from 'joi';

export interface DBConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  name: string;
  log: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export interface RedisCache {
  ttl: number;
  max: number;
}

export interface RedisQueue {
  backoff: number;
  attempts: number;
  removeOnComplete: boolean;
  removeOnFail: boolean;
}

export interface RmqConfig {
  url: string;
  name: string;
}

export interface SMTPEmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
}

export interface S3Config {
  bucket: string;
  s3url: string;
  key: string;
  secret: string;
  region: string;
  expire: number;
}

export interface OIDCConfig {
  providerIssuer: string;
  clientId: string;
  clientSecret: string;
  scope: string;
  audience: string;
}

export interface QueryResultCacheCofig {
  tl: number;
  type: string;
  host: string;
  port: number;
}

export class ConfigService {
  private readonly envConfig: dotenv.DotenvParseOutput;
  private readonly validationScheme = {
    PORT: Joi.number().default(3000),
    BASE_PATH: Joi.string().default('/'),

    JWT_SECRET: Joi.string().default('gXmEgPHW'),
    JWT_EXPIRATION_TIME: Joi.string().default('5m'),

    LOG_LEVEL: Joi.string().default('debug'),

    TENANT_BASE_APP: Joi.boolean().default(true),

    DB_WRITE_HOST: Joi.string().required(),
    DB_WRITE_PORT: Joi.number().required(),
    DB_WRITE_USER: Joi.optional(),
    DB_WRITE_PASS: Joi.optional(),
    DB_WRITE_NAME: Joi.string().required(),
    DB_WRITE_LOG: Joi.boolean().default(false),

    DB_READ_HOST: Joi.string().required(),
    DB_READ_PORT: Joi.number().required(),
    DB_READ_USER: Joi.optional(),
    DB_READ_PASS: Joi.optional(),
    DB_READ_NAME: Joi.string().required(),
    DB_READ_LOG: Joi.boolean().default(false),

    CACHE_QUERY_RESULT_TL: Joi.number().default(10000),
    CACHE_QUERY_RESULT_TYPE: Joi.string().default('redis'),
    CACHE_QUERY_RESULT_HOST: Joi.string().default('localhost'),
    CACHE_QUERY_RESULT_PORT: Joi.number().default('6379'),

    DEFAULT_WORK_TIME: Joi.number().default(8),

    // REDIS_HOST: Joi.string().required(),
    // REDIS_PORT: Joi.number().required(),
    // REDIS_USER: Joi.optional(),
    // REDIS_PASS: Joi.optional(),

    // REDIS_CACHE_TTL: Joi.number().default(60),
    // REDIS_CACHE_MAX: Joi.number().default(1000),

    // REDIS_QUEUE_BACKOFF: Joi.number().default(3),
    // REDIS_QUEUE_ATTEMPTS: Joi.number().default(3),
    // REDIS_QUEUE_REMOVE_ON_COMPLETE: Joi.boolean().default(true),
    // REDIS_QUEUE_REMOVE_ON_FAIL: Joi.boolean().default(true),

    // REDIS_URL: Joi.string().empty(''),

    // AWS_BUCKET: Joi.string().default(''),
    // AWS_S3URL: Joi.string().default(''),
    // AWS_KEY: Joi.string().default(''),
    // AWS_SECRET: Joi.string().default(''),
    // AWS_REGION: Joi.string().default(''),
    // AWS_URL_EXPIRE: Joi.number().default(604800),
  };

  constructor() {
    const nodeEnv = this.nodeEnv;
    // Try to load environment config base on current NODE_ENV
    let envConfigPath = `.${nodeEnv}.env`;
    let config = dotenv.config({ path: envConfigPath });

    if (config.error) {
      envConfigPath = '.env';
      config = dotenv.config({ path: envConfigPath });
      if (config.error) {
        throw new Error('No .env found');
      }
    }
    // console.log(process.env, config);
    this.envConfig = this.validateInput(process.env);
    // tslint:disable-next-line: no-console
    console.log(`Loaded config file at path: ${envConfigPath}`);
  }

  public get(key: string): string {
    return process.env[key];
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get port(): number {
    return Number(this.envConfig.PORT);
  }
  get basePath(): string {
    return this.envConfig.BASE_PATH;
  }

  get logLevel(): string {
    return this.envConfig.LOG_LEVEL;
  }

  get dbWrite(): DBConfig {
    return {
      host: String(this.envConfig.DB_WRITE_HOST),
      port: Number(this.envConfig.DB_WRITE_PORT),
      user: String(this.envConfig.DB_WRITE_USER),
      pass: String(this.envConfig.DB_WRITE_PASS),
      name: String(this.envConfig.DB_WRITE_NAME),
      log: Boolean(this.envConfig.DB_WRITE_LOG),
    };
  }

  get dbRead(): DBConfig {
    return {
      host: String(this.envConfig.DB_READ_HOST),
      port: Number(this.envConfig.DB_READ_PORT),
      user: String(this.envConfig.DB_READ_USER),
      pass: String(this.envConfig.DB_READ_PASS),
      name: String(this.envConfig.DB_READ_NAME),
      log: Boolean(this.envConfig.DB_READ_LOG),
    };
  }

  get queryResultCacheConfig(): QueryResultCacheCofig {
    return {
      tl: this.envConfig.CACHE_QUERY_RESULT_TL as unknown as number,
      type: this.envConfig.CACHE_QUERY_RESULT_TYPE,
      host: this.envConfig.CACHE_QUERY_RESULT_HOST,
      port: this.envConfig.CACHE_QUERY_RESULT_PORT as unknown as number,
    };
  }

  get rmq(): RmqConfig {
    if (!this.envConfig.RMQ_HOST) {
      return null;
    }

    let url = 'amqp://';
    if (this.envConfig.RMQ_USER) {
      url += this.envConfig.RMQ_USER;
      if (this.envConfig.RMQ_PASS) {
        url += `:${this.envConfig.RMQ_PASS}`;
      }
      url += '@';
    }
    url += `${this.envConfig.RMQ_HOST}`;
    if (this.envConfig.RMQ_PORT) {
      url += `:${this.envConfig.RMQ_PORT}`;
    }
    if (this.envConfig.RMQ_PATH) {
      url += `/${this.envConfig.RMQ_PATH}`;
    }
  }

  get aws(): S3Config {
    return {
      bucket: String(this.envConfig.AWS_BUCKET),
      s3url: String(this.envConfig.AWS_S3URL),
      key: String(this.envConfig.AWS_KEY),
      secret: String(this.envConfig.AWS_SECRET),
      region: String(this.envConfig.AWS_REGION),
      expire: Number(this.envConfig.AWS_URL_EXPIRE),
    };
  }

  get redisCfg(): RedisConfig {
    return {
      host: String(this.envConfig.REDIS_HOST),
      port: Number(this.envConfig.REDIS_PORT),
      user: String(this.envConfig.REDIS_USER),
      pass: String(this.envConfig.REDIS_PASS),
    };
  }

  get redisCache(): RedisCache {
    return {
      ttl: Number(this.envConfig.REDIS_CACHE_TTL),
      max: Number(this.envConfig.REDIS_CACHE_MAX),
    };
  }
  get redisUrl(): string {
    return this.envConfig.REDIS_URL;
  }

  get redisQueue(): RedisQueue {
    return {
      backoff: Number(this.envConfig.REDIS_QUEUE_BACKOFF),
      attempts: Number(this.envConfig.REDIS_QUEUE_ATTEMPTS),
      removeOnComplete: Boolean(this.envConfig.REDIS_QUEUE_REMOVE_ON_COMPLETE),
      removeOnFail: Boolean(this.envConfig.REDIS_QUEUE_REMOVE_ON_FAIL),
    };
  }

  private validateInput(envConfig: dotenv.DotenvParseOutput): dotenv.DotenvParseOutput {
    const envVarsSchema: Joi.ObjectSchema = Joi.object(this.validationScheme);

    const result = envVarsSchema.validate(envConfig, { allowUnknown: true });
    if (result.error) {
      throw new Error(`Config validation error: ${result.error.message}`);
    }
    return result.value;
  }

  get isTenantBasedApp() {
    return new Boolean(this.envConfig.TENANT_BASE_APP).valueOf();
  }
}
