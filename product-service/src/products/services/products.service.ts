import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaginatedProducts } from 'src/interfaces';
import { UserDocument } from 'src/products/schemas/user.schema';
import { sampleProduct } from '../../utils/data/product';
import { Product, ProductDocument } from '../schemas/product.schema';
import { createProductDto } from '../dtos/products/create.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel("Product") private productModel: Model<ProductDocument>
  ) {}

  async findTopRated(): Promise<ProductDocument[]> {
    const products = await this.productModel
      .find({})
      .sort({ rating: -1 })
      .limit(3);

    if (!products.length) throw new RpcException({
      message: 'No products found.',
      statusCode: HttpStatus.CONFLICT, // Set the desired status code
    })

    return products;
  }

  async findMany(
    keyword?: string,
    pageId?: string
  ): Promise<PaginatedProducts> {
    const pageSize = 2;
    const page = parseInt(pageId) || 1;

    const rgex = keyword ? { name: { $regex: keyword, $options: 'i' } } : {};

    const count = await this.productModel.countDocuments({ ...rgex });
    const products = await this.productModel
      .find({ ...rgex })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (!products.length) throw new RpcException({
      message: 'No products found.',
      statusCode: HttpStatus.CONFLICT, // Set the desired status code
    })

    return { products, page, pages: Math.ceil(count / pageSize) };
  }

  async findById(id: string): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new RpcException({
      message: 'No product with given ID.',
      statusCode: HttpStatus.CONFLICT, // Set the desired status code
    })

    return product;
  }

  async createMany(
    products: Partial<ProductDocument>[]
  ): Promise<ProductDocument[]> {
    const createdProducts:any = await this.productModel.insertMany(products);

    return createdProducts;
  }

  async createSample(data:createProductDto) {
      const createdProduct = await this.productModel.create(data);
      return createdProduct;

  }

  async update(
    id: string,
    attrs: Partial<ProductDocument>
  ): Promise<ProductDocument> {
    const { name, price, description, image, brand, category, countInStock } =
      attrs;

    if (!Types.ObjectId.isValid(id))
      throw new RpcException({
        message: 'Invalid product ID.',
        statusCode: HttpStatus.CONFLICT, // Set the desired status code
      })
      

    const product = await this.productModel.findById(id);

    if (!product) throw new RpcException({
      message: 'No product with given ID.',
      statusCode: HttpStatus.CONFLICT, // Set the desired status code
    })

    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    const updatedProduct = await product.save();

    return updatedProduct;
  }

  async createReview(
    id: string,
    user: Partial<UserDocument>,
    rating: number,
    comment: string
  ): Promise<ProductDocument> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid product ID.');

    const product = await this.productModel.findById(id);

    if (!product) throw new RpcException({
      message: 'No product with given ID.',
      statusCode: HttpStatus.CONFLICT, // Set the desired status code
    })

    const alreadyReviewed = product.reviews.find(
      r => r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed)
      throw new RpcException({
        message: 'Product already reviewed!',
        statusCode: HttpStatus.CONFLICT, // Set the desired status code
      })
    

    const review:any = {
      name: user.name,
      rating,
      comment,
      user: user._id,
    };

    product.reviews.push(review);

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    product.numReviews = product.reviews.length;

    const updatedProduct = await product.save();

    return updatedProduct;
  }

  async deleteOne(id: string): Promise<void> {
    const product:any = await this.productModel.findById(id);
    if (!product)  throw new RpcException({
      message: 'Product not found',
      statusCode: HttpStatus.NOT_FOUND, // Set the desired status code
    });

    return  await product.deleteOne({_id:id});
  }

  async deleteMany(): Promise<void> {
    await this.productModel.deleteMany({});
  }
}
