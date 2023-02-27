import { Module } from '@nestjs/common';
import { MyloggerService } from './mylogger.service';

@Module({
  providers: [MyloggerService],
  exports: [MyloggerService],
})
export class MyloggerModule {}
