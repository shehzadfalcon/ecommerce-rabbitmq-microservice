import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProductsService } from '../services/products.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { createProductDto } from '../dtos/products/create.dto';
import { createReviewDto } from '../dtos/products/review.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @MessagePattern({ cmd: 'GET_PRODUCTS' })
  // @Get()
  getProducts(
    @Payload() data: {keyword:string,pageId:string}

  ) {
    return this.productsService.findMany(data.keyword, data.pageId);
  }

  @MessagePattern({ cmd: 'GET_TOP_RATED_PRODUCTS' })
  // @Get('topRated')
  getTopRatedProducts() {
    return this.productsService.findTopRated();
  }

  @MessagePattern({ cmd: 'GET_SINGLE_PRODUCT' })
  // @Get(':id')
  getProduct(@Payload() id: string) {
    return this.productsService.findById(id);
  }

  // @UseGuards(AdminGuard)
  // @Delete(':id')
  @MessagePattern({ cmd: 'DELETE_SINGLE_PRODUCT' })
 async deleteUser(@Payload() id: string) {
    const product= await this.productsService.deleteOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: "Product Delete",
      data:product
    };
  }

  // @UseGuards(AdminGuard)
  // @Post()
  @MessagePattern({ cmd: 'CREATE_PRODUCT' })
  createProduct(@Payload() data: createProductDto) {
    return this.productsService.createSample(data);
  }

  // @UseGuards(AdminGuard)
  // @Put(':id')
  @MessagePattern({ cmd: 'UPDATE_PRODUCT' })
  updateProduct(@Payload() data: any) {
    return this.productsService.update(data.id, data.body);
  }

  // @UseGuards(AuthGuard)

  // @Put(':id/review')
  @MessagePattern({ cmd: 'ADD_REVIEW_PRODUCT' })
  createReview(
    @Param('id') id: string,
    @Body() { rating, comment }: createReviewDto,
    @Session() session: any
  ) {
    return this.productsService.createReview(id, session.user, rating, comment);
  }
}
