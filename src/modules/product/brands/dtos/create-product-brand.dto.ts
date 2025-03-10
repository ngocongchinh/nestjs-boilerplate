import { IsString, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductBrandDto {
  @ApiProperty({ example: 'brand-1', description: 'Slug of the brand' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Brand One', description: 'Name of the brand' })
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
