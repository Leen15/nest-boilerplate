import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from 'nestjs-pino';
import { SerializedRequest, SerializedResponse, pino } from 'pino';
// import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
// import * as winston from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    LoggerModule.forRoot({
      pinoHttp:
        {
          level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
          // install 'pino-pretty' package in order to use the following option
          transport: process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
          serializers: {
            req: pino.stdSerializers.wrapRequestSerializer((req: SerializedRequest) => {
              return {
                id: req.raw.id,
                method: req.raw.method,
                path: req.raw.url.split('?')[0], // Remove query params which might be sensitive
                // Allowlist useful headers
                query: req.query,
                params: req.params,
                headers: {
                  // host: req.raw.headers.host,
                  'user-agent': req.raw.headers['user-agent'],
                  referer: req.raw.headers.referer,
                }
              };
            }),
            res: pino.stdSerializers.wrapResponseSerializer((res: SerializedResponse) => {
              return {
                statusCode: res.raw.statusCode,
              };
            }),
          },
          // and all the other fields of:
          // - https://github.com/pinojs/pino-http#api
          // - https://github.com/pinojs/pino/blob/HEAD/docs/api.md#options-object
        },
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.PG_HOST,
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      port: parseInt(process.env.PG_PORT) || 8432,
      database: process.env.PG_DB ||'tanks-monitoring-dev',
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}
