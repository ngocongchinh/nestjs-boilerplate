import { IsString, IsInt, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductAttributeDto {
  @ApiProperty({ example: 'Color', description: 'Name of the attribute' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'SKU123', description: 'SKU of the attribute' })
  @IsString()
  sku: string;

  @ApiProperty({ example: 50.0, description: 'Price of the attribute' })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 10.0,
    description: 'Discount of the attribute',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: 100, description: 'Quantity of the attribute' })
  @IsInt()
  quantity: number;

  @ApiProperty({
    example: 1,
    description: 'Status (1: active, 0: inactive)',
    required: false,
  })
  @IsEnum([0, 1])
  @IsInt()
  status?: number = 1;
}
