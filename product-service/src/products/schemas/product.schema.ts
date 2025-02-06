import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';

export type ProductDocument = mongoose.HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Review {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    default: null,
  })
  user: User;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  comment: string;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: false })
  name: string;

  @Prop({ required: false })
  brand: string;

  @Prop({ required: false })
  category: string;

  @Prop({ require: false })
  image: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: false })
  reviews: Review[];

  @Prop({ required: false, default: 0 })
  rating: number;

  @Prop({ required: false, default: 0 })
  numReviews: number;

  @Prop({ required: false, default: 0 })
  price: number;

  @Prop({ required: false, default: 0 })
  countInStock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
