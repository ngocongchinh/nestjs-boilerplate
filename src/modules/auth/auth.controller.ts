import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiQuery({ name: 'tenant', required: false, description: 'Tenant name' })
  @ApiResponse({ status: 200, description: 'Login successful', type: Object })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Query('tenant') tenantName: string) {
    return this.authService.login(loginDto, tenantName);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  logout() {
    // Token đã được xác thực qua AuthGuard, chỉ cần gọi logout
    return this.authService.logout();
  }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user (Super Admin/Admin can specify tenant)',
  })
  @ApiQuery({ name: 'tenant', required: true, description: 'Tenant name' })
  @ApiResponse({ status: 201, description: 'User registered', type: Object })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async register(
    @Body() registerDto: RegisterDto,
    @Query('tenant') tenantName: string,
    @Req() req,
  ) {
    const isAuthenticated = req.user; // Kiểm tra xem có token không
    if (isAuthenticated) {
      const isSuperAdmin = req.user.roles?.some(
        (role: any) => role.name === 'super',
      );
      const isAdmin = req.user.roles?.some(
        (role: any) => role.name === 'manager',
      );
      if (!isSuperAdmin && !isAdmin) {
        throw new ForbiddenException(
          'Only Super Admin or Admin can register users with authentication',
        );
      }
      return this.authService.register(registerDto, tenantName);
    } else {
      // User tự đăng ký, role mặc định là 'user'
      if (!tenantName) {
        throw new BadRequestException(
          'Tenant name is required for registration',
        );
      }
      return this.authService.register(registerDto, tenantName);
    }
  }

  @Get('activate')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiQuery({
    name: 'token',
    type: String,
    description: 'Activation token from email',
  })
  @ApiResponse({ status: 200, description: 'Account activated successfully' })
  async activate(@Query('token') token: string) {
    return this.authService.activate(token);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send password reset link' })
  @ApiResponse({ status: 200, description: 'Reset link sent', type: Object })
  @ApiResponse({ status: 401, description: 'User not found' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendPasswordResetLink(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiResponse({
    status: 200,
    description: 'Password reset successful',
    type: Object,
  })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Req() req) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = req.user; // Loại bỏ password
    return userWithoutPassword;
  }
}
