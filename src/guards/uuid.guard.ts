// uuid.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class UuidGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userId = request.params.id;

    if (!validate(userId)) {
      throw new HttpException('Invalid user ID', HttpStatus.BAD_REQUEST);
    }

    return true;
  }
}
