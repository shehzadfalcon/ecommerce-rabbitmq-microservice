import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class createReviewDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, title: 'comment' })
  comment: string;

  @IsNotEmpty()
  @ApiProperty({ type: Number, title: 'rating' })
  rating: number;

}
