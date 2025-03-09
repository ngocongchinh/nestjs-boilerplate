import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { TwoFactorService } from './two-factor.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('two-factor')
@Controller('auth/two-factor')
export class TwoFactorController {
  constructor(private twoFactorService: TwoFactorService) {}

  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate 2FA secret' })
  @ApiResponse({
    status: 200,
    description: '2FA secret generated',
    type: String,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async generate(@Req() req) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }
    return this.twoFactorService.generateTwoFactorSecret(
      req.user.userId,
      tenantId,
    );
  }

  @Post('verify')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify 2FA token' })
  @ApiResponse({
    status: 200,
    description: 'Verification result',
    type: Boolean,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verify(@Req() req, @Body('token') token: string) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }
    return this.twoFactorService.verifyTwoFactorToken(
      req.user.userId,
      token,
      tenantId,
    );
  }

  @Post('send-email')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send 2FA code via email' })
  @ApiResponse({ status: 200, description: 'Email sent' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendEmail(@Req() req) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }
    return this.twoFactorService.sendTwoFactorEmail(req.user.userId, tenantId);
  }
}
