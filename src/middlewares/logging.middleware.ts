import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggingService: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, url, query, body } = req;

    this.loggingService.log(`Request: ${method} ${url}`);
    this.loggingService.log(`Query: ${JSON.stringify(query)}`);
    this.loggingService.log(`Body: ${JSON.stringify(body)}`);

    const oldSend = res.send;

    res.send = (data): Response => {
      this.loggingService.log(`Response Status: ${res.statusCode}`);
      this.loggingService.log(`Response Body: ${data}`);
      return oldSend.call(res, data);
    };

    next();
  }
}
