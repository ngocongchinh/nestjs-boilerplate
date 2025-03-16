import {
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsInt,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../tenants/tenants.entity';
import { Role } from '../../roles/roles.entity';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '123456789',
    required: false,
  })
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  isActivated?: boolean;

  @ApiProperty({
    description: 'Activation token',
    required: false,
  })
  @IsOptional()
  activationToken?: string | null | undefined;

  @ApiProperty({
    description: 'Two-factor authentication status',
    example: false,
    required: false,
  })
  @IsOptional()
  tenant?: Tenant;
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
  @IsOptional()
  roleIds: number[];

  @IsOptional()
  isTwoFactorEnabled?: boolean;

  @ApiProperty({
    description: 'Account lock status',
    example: false,
    required: false,
  })
  @IsOptional()
  isLocked?: boolean;

  @ApiProperty({
    description: 'Two-factor secret',
    example: 'secret',
    required: false,
  })
  @IsOptional()
  twoFactorSecret?: string;
}
