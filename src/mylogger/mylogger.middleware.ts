import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyloggerService } from './mylogger.service';

@Injectable()
export class MyloggerMiddleware implements NestMiddleware {
  constructor(private myLoggerService: MyloggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.myLoggerService.setContext('Request');
    const auth = req.headers.authorization;
    this.myLoggerService.log(
      `ROUTE: {${req.originalUrl}, ${req.method}}, Body: ${JSON.stringify(
        req.body,
      )}${auth ? ', Auth: ' + JSON.stringify(auth) : ''}`,
    );
    next();
  }
}
