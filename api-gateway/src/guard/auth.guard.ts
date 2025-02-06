import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import 'dotenv/config';

import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    

    if (!request.headers.authorization) {
      return false;
    }

    request.user = await this.validateToken(request.headers.authorization);
    return true;
  }

  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const token = auth.split(' ')[1];

    try {
      const decoded: any = await jwt.verify(
        token,
        process.env.JWT_SECRET,
      );

      // if(!decoded?.isAdmin){
      //   throw new HttpException("Permission Denied: You are not an admin", HttpStatus.UNAUTHORIZED);
      // }
      return decoded;
    } catch (err) {
      const message =  (err.message || err.name);
      
      throw new HttpException(message, HttpStatus.UNAUTHORIZED);
    }
  }
}
