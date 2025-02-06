import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Session,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProfileDto } from '../dtos/profile.dto';
import { RegisterDto } from '../dtos/register.dto';
import { UserDto } from '../dtos/user.dto';
import { UserDocument } from '../schemas/user.schema';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LoginDto } from '../dtos/auth/login.dto';

// @Serialize(UserDto)
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  // @UseGuards(LocalAuthGuard)
  @MessagePattern({ cmd: 'LOGIN_USER' })
  @Post('login')
  async login(@Payload() data:LoginDto) {
    
    const loggedUser = await this.authService.login(data);
    return loggedUser;
  }


  // @Post('register')
  @MessagePattern({ cmd: 'REGISTER' })
  async register(
    @Payload() { fullName, email, password }: RegisterDto,
  ) {
    const user = await this.authService.register(fullName, email, password);

    return user;
  }


}
