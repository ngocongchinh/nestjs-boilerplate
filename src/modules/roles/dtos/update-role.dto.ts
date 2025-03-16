import {
  IsString,
  IsInt,
  MinLength,
  IsOptional,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({
    example: 'manager',
    description: 'Name of the role',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Description of the role',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [1, 3],
    description: 'Array of permission IDs for the role',
    required: false,
  })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  permissionIds?: number[];
}
