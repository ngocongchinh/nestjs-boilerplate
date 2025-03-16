import {
  ArrayMinSize,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../tenants/tenants.entity';
import { Role } from '../../roles/roles.entity';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    description: 'Status of the user',
    required: false,
  })
  @IsOptional()
  isActivated?: boolean;

  @ApiProperty({
    description: 'Activation token',
    required: false,
  })
  @IsOptional()
  activationToken?: string | null | undefined;

  @ApiProperty({
    description: 'Tenant associated with the user',
    type: () => Tenant,
    required: false,
  })
  @IsOptional()
  tenant?: Tenant;

  @IsOptional()
  tenantId: number;

  @ApiProperty({
    description: 'Roles assigned to the user',
    type: () => [Role],
    required: false,
  })
  @ApiProperty({
    example: [1, 2],
    description: 'Array of role IDs for the user',
  })
  @IsInt({ each: true })
  @Min(1, { each: true })
  @ArrayMinSize(1) // Yêu cầu ít nhất 1 role
  roleIds: number[];

  @ApiProperty({
    example: 'ldap',
    description: 'Authentication provider (e.g., ldap, google)',
    required: false,
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiProperty({
    example: 'uid123',
    description: 'Provider-specific user ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  providerId?: string;
}
