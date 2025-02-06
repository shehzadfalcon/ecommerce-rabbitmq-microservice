import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AdminProfileDto } from '../dtos/admin.profile.dto';
import { UserDto } from '../dtos/user.dto';
import { UsersService } from '../services/users.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Serialize(UserDto)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @UseGuards(AdminGuard)
  // @Get()
  @MessagePattern({ cmd: 'GET_USERS' })
  getUsers() {
    return this.usersService.findAll();
  }

  // @UseGuards(AdminGuard)
  // @Delete(':id')
  @MessagePattern({ cmd: 'DELETE_USER' })
  deleteUser(@Payload() id: string) {
    return this.usersService.deleteOne(id);
  }

  // @UseGuards(AdminGuard)
  // @Get(':id')
  @MessagePattern({ cmd: 'GET_SINGLE_USER' })
  getUser(@Payload() id: string) {
    return this.usersService.findById(id);
  }

  // @UseGuards(AdminGuard)
  // @Put(':id')
  @MessagePattern({ cmd: 'UPDATE_USER' })
  async updateUser(
    @Payload() data: any
  ) {
    return this.usersService.adminUpdate(data.id, data.body);
  }
}
