import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  BadRequestException,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { TenantsService } from '../tenants/tenants.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(
    private rolesService: RolesService,
    private tenantsService: TenantsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiQuery({
    name: 'tenant',
    required: false,
    description: 'Tenant name (Super Admin/Admin only)',
  })
  @ApiResponse({ status: 201, description: 'Role created', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body('name') name: string,
    @Query('tenant') tenantName: string,
    @Req() req,
  ) {
    const userTenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles?.some(
      (role: any) => role.name === 'super_admin',
    );
    const isAdmin = req.user.roles?.some((role: any) => role.name === 'admin');
    let targetTenantId = userTenantId;

    if (tenantName) {
      const tenant = await this.tenantsService.findByName(tenantName);
      if (!tenant) {
        throw new BadRequestException(`Tenant '${tenantName}' does not exist`);
      }
      if (isSuperAdmin) {
        targetTenantId = tenant.id;
      } else if (isAdmin && tenant.id === userTenantId) {
        targetTenantId = tenant.id;
      } else {
        throw new ForbiddenException(
          'You do not have permission to create roles for this tenant',
        );
      }
    } else if (!isSuperAdmin && !isAdmin) {
      throw new ForbiddenException(
        'Only Super Admin or Admin can create roles',
      );
    } else if (!userTenantId && !isSuperAdmin) {
      throw new BadRequestException(
        'Tenant ID is required for non-Super Admin',
      );
    }

    if (!targetTenantId && !isSuperAdmin) {
      throw new BadRequestException('Tenant ID is required');
    }

    // Admin không tạo được Admin hoặc Super Admin
    if (isAdmin && (name === 'admin' || name === 'super_admin')) {
      throw new ForbiddenException(
        'Admin cannot create Admin or Super Admin roles',
      );
    }

    return this.rolesService.create(name, targetTenantId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiQuery({
    name: 'tenant',
    required: false,
    description: 'Tenant name (Super Admin only)',
  })
  @ApiResponse({ status: 200, description: 'Role retrieved', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Param('id') id: string,
    @Query('tenant') tenantName: string,
    @Req() req,
  ) {
    const userTenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles?.some(
      (role: any) => role.name === 'super_admin',
    );
    let targetTenantId = userTenantId;

    if (tenantName && isSuperAdmin) {
      const tenant = await this.tenantsService.findByName(tenantName);
      if (!tenant) {
        throw new BadRequestException(`Tenant '${tenantName}' does not exist`);
      }
      targetTenantId = tenant.id;
    }

    if (!targetTenantId && !isSuperAdmin) {
      throw new BadRequestException('Tenant ID is required');
    }
    return this.rolesService.findOne(+id, targetTenantId);
  }
}
