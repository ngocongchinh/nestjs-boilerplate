import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset token received via email',
    example: 'jwt_token_here',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'New password for the user',
    example: 'newpassword123',
  })
  @IsNotEmpty()
  newPassword: string;
}
