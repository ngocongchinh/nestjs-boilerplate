import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  Req,
  BadRequestException,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TenantsService } from '../tenants/tenants.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tenantsService: TenantsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiQuery({
    name: 'tenant',
    required: false,
    description: 'Tenant name (Super Admin/Admin only)',
  })
  @ApiResponse({ status: 201, description: 'User created', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createUserDto: CreateUserDto,
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
        targetTenantId = tenant.id; // Super Admin có thể tạo ở bất kỳ tenant
      } else if (isAdmin && tenant.id === userTenantId) {
        targetTenantId = tenant.id; // Admin chỉ tạo trong tenant của mình
      } else {
        throw new ForbiddenException(
          'You do not have permission to create users for this tenant',
        );
      }
    } else if (!isSuperAdmin && !isAdmin) {
      throw new ForbiddenException(
        'Only Super Admin or Admin can create users',
      );
    } else if (!userTenantId && !isSuperAdmin) {
      throw new BadRequestException(
        'Tenant ID is required for non-Super Admin',
      );
    }

    if (!targetTenantId && !isSuperAdmin) {
      throw new BadRequestException('Tenant ID is required');
    }

    // Admin chỉ được tạo Editor hoặc User
    if (
      isAdmin &&
      createUserDto.roles?.some(
        (role) => role.name === 'admin' || role.name === 'super_admin',
      )
    ) {
      throw new ForbiddenException(
        'Admin cannot create Admin or Super Admin roles',
      );
    }

    createUserDto.tenant = { id: targetTenantId } as any;
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiQuery({
    name: 'tenant',
    required: false,
    description: 'Tenant name (Super Admin only)',
  })
  @ApiResponse({ status: 200, description: 'User retrieved', type: Object })
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
    return this.usersService.findOne(+id, targetTenantId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, description: 'User updated', type: Object })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    const tenantId = req.user.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Tenant ID is required');
    }
    return this.usersService.update(+id, updateUserDto, tenantId);
  }
}
