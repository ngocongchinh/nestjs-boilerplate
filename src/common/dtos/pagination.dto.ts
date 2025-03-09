import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ example: 1, description: 'Page number', required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 10, description: 'Items per page', required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
