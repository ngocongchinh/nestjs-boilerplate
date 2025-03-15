import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsInt({ message: 'page must be an integer number' })
  @Min(1, { message: 'page must not be less than 1' })
  @IsOptional()
  @Type(() => Number) // Chuyển đổi string từ query thành number
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'Items per page', required: false })
  @IsInt({ message: 'limit must be an integer number' })
  @Min(1, { message: 'limit must not be less than 1' })
  @IsOptional()
  @Type(() => Number) // Chuyển đổi string từ query thành number
  limit?: number = 10;
}
