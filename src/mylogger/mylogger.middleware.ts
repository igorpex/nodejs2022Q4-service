import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { MyloggerService } from './mylogger.service';

@Injectable()
export class MyloggerMiddleware implements NestMiddleware {
  constructor(private myLoggerService: MyloggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization;
    const now = Date.now();
    res.on('finish', () => {
      const text = `${res.statusCode} ${res.statusMessage}, {${
        req.originalUrl
      }, ${req.method}}, Body: ${JSON.stringify(req.body)}, Time: ${
        Date.now() - now
      }ms${
        // auth ? ', Auth: ' + JSON.stringify(auth) : ''
        auth ? ', Bearer provided' : 'NO Bearer'
      }`;

      if (res.statusCode >= 200 && res.statusCode < 300) {
        this.myLoggerService.log(text, 'Request');
      } else {
        this.myLoggerService.warn(text, 'Request');
      }
    });
    next();
  }
}
