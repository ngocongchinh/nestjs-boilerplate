import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('tenants')
@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new tenant (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Tenant created', type: Object })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only Super Admin can create tenants',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body('name') name: string, @Req() req) {
    const isSuperAdmin = req.user.roles?.some(
      (role: any) => role.name === 'super_admin',
    );
    if (!isSuperAdmin) {
      throw new ForbiddenException('Only Super Admin can create tenants');
    }
    return this.tenantsService.create(name);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(+id);
  }
}
