import { IsString, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductSupplierDto {
  @ApiProperty({ example: 'supplier-1', description: 'Slug of the supplier' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'Supplier One', description: 'Name of the supplier' })
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
