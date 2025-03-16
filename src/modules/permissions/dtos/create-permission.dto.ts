import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'create_user',
    description: 'Name of the permission',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    example: 'Allow creating users',
    description: 'Description of the permission',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
