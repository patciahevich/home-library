import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('CustomLogger');

  log(message: string): void {
    this.logger.log(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string, trace?: string): void {
    this.logger.error(message, trace);
  }
}
