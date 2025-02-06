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
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { catchError, timeout } from 'rxjs';
import { UserDecorator } from 'src/decorators/user.decorator';
import { UpdateProfileDto } from 'src/dtos/users/update.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('users')
export class UsersController {
  constructor(
    @Inject('USER_SERVICE') private readonly amqClient: ClientProxy,
  ) {}

  @Get('/')
  getAll() {
    return this.amqClient.send({ cmd: 'GET_USERS' }, {})
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.amqClient.send({ cmd: 'DELETE_USER' }, id)
  }

  @Get('/profile')
  getOne(@UserDecorator() authUser: any) {
    return this.amqClient.send({ cmd: 'GET_SINGLE_USER' }, authUser._id)
  }

  @Patch('/')
  @ApiBody({ type: UpdateProfileDto })
  update(@Req() req: Request, @Param('id') id: string) {
    return this.amqClient
      .send({ cmd: 'UPDATE_USER' }, { body: req.body, id })
      
  }
}
