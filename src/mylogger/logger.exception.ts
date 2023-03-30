import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { MyloggerService } from './mylogger.service';

@Catch()
export class MyloggerExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly myloggerService: MyloggerService) {
    super();
  }
  catch(exception: unknown, host: ArgumentsHost) {
    this.myloggerService.error(`${exception}`, 'CustomException');
    super.catch(exception, host);
  }
}
