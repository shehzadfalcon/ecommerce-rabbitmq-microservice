import {
  Controller,
  Delete,
  Get,
  HttpException,
  UseGuards,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Req,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { createProductDto } from 'src/dtos/products/create.dto';
import { catchError, timeout, throwError } from 'rxjs';
import { AuthGuard } from 'src/guard/auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
@Controller('products')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@ApiTags('products')
export class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly amqClient: ClientProxy,
  ) {}

  @Post('/')
  @ApiBody({ type: createProductDto })
  create(@Req() req: Request) {
    return this.amqClient.send({ cmd: 'CREATE_PRODUCT' }, req.body);
  }

  @Patch('/')
  @ApiBody({ type: createProductDto })
  update(@Req() req: Request, @Param('id') id: string) {
    return this.amqClient.send(
      { cmd: 'UPDATE_PRODUCT' },
      { body: req.body, id },
    );
  }

  @Get('/all')
  getAll(@Query('keyword') keyword: string, @Query('pageId') pageId: string) {
    return this.amqClient.send({ cmd: 'GET_PRODUCTS' }, {keyword,pageId});
  }

  @Get('/topRated')
  getTopRated(@UserDecorator() authUser: any) {
    return this.amqClient.send({ cmd: 'GET_TOP_RATED_PRODUCTS' }, {});
  }

  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.amqClient.send({ cmd: 'GET_SINGLE_PRODUCT' }, id);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.amqClient.send({ cmd: 'DELETE_SINGLE_PRODUCT' }, id);
  }
}
