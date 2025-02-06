import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class createProductDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, title: 'name' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, title: 'description' })
  description: string;

  // @IsNotEmpty()
  @ApiProperty({ type: String, title: 'category' })
  category: string;

  // @IsNotEmpty()
  @ApiProperty({ type: Number, title: 'rating' })
  rating: number;

  // @IsNotEmpty()
  @ApiProperty({ type: Number, title: 'countInStock' })
  countInStock: number;
}
