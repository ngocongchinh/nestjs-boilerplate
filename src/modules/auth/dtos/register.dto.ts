import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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
}
