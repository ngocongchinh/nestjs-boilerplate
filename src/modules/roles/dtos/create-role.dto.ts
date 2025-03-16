import {
  IsString,
  IsInt,
  MinLength,
  IsOptional,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'manager', description: 'Name of the role' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'Manage tenant resources',
    description: 'Description of the role',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: [1, 2],
    description: 'Array of permission IDs for the role',
  })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayMinSize(1)
  permissionIds: number[];
}
