import { Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { saveArticleDto } from './dtos/articles/create.dto';

@Controller('article')
@ApiTags('article')
export class AppController {
  constructor(
    @Inject('ARTICLES_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  @Post('/save-reader')
  saveReader(@Req() req: Request) {
    return this.natsClient.send({ cmd: 'SAVE_READER' }, req.body);
  }

  @Get('/get-all-readers')
  getReaders(@Req() req: Request) {
    return this.natsClient.send({ cmd: 'GET_ALL_READERS' }, req.body);
  }

  @Post('/save-article')
  @ApiBody({ type: saveArticleDto })
  saveArticle(@Req() req: Request) {
    return this.natsClient.send({ cmd: 'SAVE_ARTICLE' }, req.body);
  }

  @Get('/get-all-articles')
  getAllArticles(@Req() req: Request) {
    console.log(11);
    return this.natsClient.send({ cmd: 'GET_ALL_ARTICLES' }, req.body);
  }

  @Post('/delete-article')
  deleteArticle(@Req() req: Request) {
    return this.natsClient.send({ cmd: 'DELETE_ARTICLE' }, req.body);
  }
}
