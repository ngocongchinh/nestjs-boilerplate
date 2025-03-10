import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductCategoryDto {
  @ApiProperty({ example: 'category-1', description: 'Slug of the category' })
  @IsString()
  slug: string;

  @ApiProperty({
    example: 0,
    description: 'Parent category ID',
    required: false,
  })
  @IsInt()
  @IsOptional()
  parent?: number;

  @ApiProperty({
    example: '/images/cat1.jpg',
    description: 'Image URL',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    example: 'Category description',
    description: 'Description',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Category One', description: 'Name of the category' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 1,
    description: 'Status (1: active, 0: inactive)',
    required: false,
  })
  @IsEnum([0, 1])
  @IsInt()
  status?: number = 1;
}
