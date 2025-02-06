import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
  RequestTimeoutException,
  HttpException,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export const Serialize = () => {
  return UseInterceptors(new TimeoutInterceptor());
};


export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => err);
      }),
    );
  };
};
