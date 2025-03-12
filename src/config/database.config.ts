import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
  logging: configService.get<string>('NODE_ENV') === 'development',
  poolSize: 10, // Connection pooling
  extra: {
    max: 20, // Maximum number of connections
    min: 2, // Minimum number of connections
    idleTimeoutMillis: 30000, // Close idle connections after 30s
  },
});
