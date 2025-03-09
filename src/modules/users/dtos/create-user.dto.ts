import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
    description: 'Tenant associated with the user',
    type: () => Tenant,
    required: false,
  })
  @IsOptional()
  tenant?: Tenant;

  @ApiProperty({
    description: 'Roles assigned to the user',
    type: () => [Role],
    required: false,
  })
  @IsOptional()
  roles?: Role[];

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
