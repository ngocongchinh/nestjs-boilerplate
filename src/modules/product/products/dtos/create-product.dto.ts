import { IsString, IsInt, IsEnum, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'product-name', description: 'Slug of the product' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 1, description: 'Category ID' })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  @IsInt()
  brandId: number;

  @ApiProperty({ example: [1, 2], description: 'Array of supplier IDs' })
  @IsArray()
  @IsInt({ each: true })
  suppliers: number[];

  @ApiProperty({ example: 100.5, description: 'Price of the product' })
  @IsInt()
  price: number;

  @ApiProperty({
    example: ['/uploads/image1.jpg'],
    description: 'Array of image URLs',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: 'Short desc',
    description: 'Short description',
    required: false,
  })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({
    example: 'Full desc',
    description: 'Full description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Status (1: active, 0: inactive)',
    required: false,
  })
  @IsEnum([0, 1])
  @IsInt()
  status?: number = 1;
}
