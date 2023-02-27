import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { MyloggerService } from './mylogger/mylogger.service';

const PORT = process.env.PORT || 4000;

BigInt.prototype['toJSON'] = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));

  const myloggerService = new MyloggerService();
  app.useLogger(myloggerService);

  process.on('unhandledRejection', async (err) => {
    myloggerService.warn(err, 'Unhandled Rejection');
  });

  process.on('uncaughtException', async (err, origin) => {
    myloggerService.error(`${err}. Origin: ${origin}.`, 'Uncaught exception');
  });

  await app.listen(PORT);
}

bootstrap();
