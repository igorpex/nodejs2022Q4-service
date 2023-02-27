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
  app.useLogger(new MyloggerService());
  await app.listen(PORT);
}
bootstrap();
