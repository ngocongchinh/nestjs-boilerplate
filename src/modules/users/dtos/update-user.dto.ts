import { IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({
    description: 'Two-factor authentication status',
    example: false,
    required: false,
  })
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
