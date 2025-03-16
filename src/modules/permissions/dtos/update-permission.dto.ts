import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePermissionDto {
  @ApiProperty({
    example: 'create_user_updated',
    description: 'Name of the permission',
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Description of the permission',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
