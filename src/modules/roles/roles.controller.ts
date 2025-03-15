import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { TenantsService } from '../tenants/tenants.service';
import { PaginationDto } from '../../common/dtos/pagination.dto';
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
    name: 'Admin',
    required: false,
    description: 'Tenant name (Super Admin/Admin only)',
  })
  @ApiResponse({ status: 201, description: 'Role created', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body('name') name: string,
    @Body('description') description: string,
    @Req() req,
  ) {
    const isSuperAdmin = req.user.roles?.some(
      (role: any) => role.name === 'super',
    );
    const isAdmin = req.user.roles?.some(
      (role: any) => role.name === 'manager',
    );
    if (!isSuperAdmin && !isAdmin) {
      throw new ForbiddenException(
        'Only Super Admin or Admin can create roles',
      );
    }

    // Admin không tạo được Admin hoặc Super Admin
    if (isAdmin && (name === 'manager' || name === 'super')) {
      throw new ForbiddenException(
        'Admin cannot create Admin or Super Admin roles',
      );
    }

    return this.rolesService.create(name, description);
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
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'List of roles retrieved' })
  async findAll(@Query() pagination: PaginationDto) {
    return this.rolesService.findAll(pagination);
  }
}
