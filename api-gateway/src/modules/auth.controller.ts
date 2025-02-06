import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Inject,
    Param,
    Patch,
    Post,
    Put,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
  import { ApiBody, ApiTags } from '@nestjs/swagger';
  import { catchError, timeout } from 'rxjs';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { RegisterDto } from 'src/dtos/auth/register.dto';
  import { UpdateProfileDto } from 'src/dtos/users/update.dto';
  
  @Controller('auth')
  @ApiTags('auth')
  export class AuthController {
    constructor(
      @Inject('USER_SERVICE') private readonly amqClient: ClientProxy,
    ) {}
  
    @Post('/login')
  @ApiBody({ type: LoginDto })
  login(@Req() req: Request) {
    return this.amqClient.send({ cmd: 'LOGIN_USER' }, req.body)
  }
  
  @Post('/register')
  @ApiBody({ type: RegisterDto })
  register(@Req() req: Request) {
    return this.amqClient.send({ cmd: 'REGISTER' }, req.body)
  }
  }
  