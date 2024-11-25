import { Injectable, Logger } from '@nestjs/common';
import * as path from 'node:path';
import * as fs from 'node:fs';

const DEFAULT_LOG_SIZE = '10485760';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('CustomLogger');
  private logDir = path.resolve(__dirname, '..', 'logs');
  private maxFileSize = parseInt(process.env.LOG_MAX_SIZE || DEFAULT_LOG_SIZE);

  private fileNumber = 1;

  constructor() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir);
    }
  }

  private writeLog(fileName: string, message: string) {
    const filePath = path.join(this.logDir, fileName);

    if (
      fs.existsSync(filePath) &&
      fs.statSync(filePath).size >= this.maxFileSize
    ) {
      const rotatedPath = filePath.replace(fileName, `-${this.fileNumber}.log`);
      fs.renameSync(filePath, rotatedPath);
      this.fileNumber++;
    }

    fs.appendFileSync(filePath, message + '\n');
  }

  log(message: string): void {
    this.logger.log(message);

    const logMessage = `${new Date().toISOString()} [INFO]: ${message}`;
    this.writeLog('application.log', logMessage);
  }

  warn(message: string): void {
    this.logger.warn(message);

    const logMessage = `${new Date().toISOString()} [WARN]: ${message}`;
    this.writeLog('application.log', logMessage);
  }

  error(message: string, trace?: string): void {
    this.logger.error(message, trace);

    const logMessage = `${new Date().toISOString()} [ERROR]: ${message} - ${
      trace || 'No trace available'
    }`;

    this.writeLog('errors.log', logMessage);
  }
}
