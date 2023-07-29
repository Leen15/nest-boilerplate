import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';


async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  app.useLogger(app.get(Logger));

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
