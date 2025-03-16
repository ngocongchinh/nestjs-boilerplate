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
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CreateRoleDto } from './dtos/create-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

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
  async create(@Body() createRoleDto: CreateRoleDto, @Req() req) {
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

    return this.rolesService.create(createRoleDto, req.user.tenantId);
  }
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a role' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  async update(
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
    @Req() req,
  ) {
    return this.rolesService.update(id, req.user.tenantId, updateRoleDto);
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
  async findOne(@Param('id') id: string, @Req() req) {
    return this.rolesService.findOne(+id, req.user.tenantId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'List of roles retrieved' })
  async findAll(@Query() pagination: PaginationDto, @Req() req) {
    return this.rolesService.findAll(req.user.tenantId, pagination);
  }
}
