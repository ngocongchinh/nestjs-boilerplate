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
import { PaginationDto } from '../../common/dtos/pagination.dto';
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

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users by tenant' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'List of users retrieved' })
  async findAll(@Query() pagination: PaginationDto, @Req() req) {
    const userRole = req.user.role?.name || '';
    return this.usersService.findAllByTenant(
      req.user.tenantId,
      pagination,
      userRole,
    );
  }

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
  async create(@Body() createUserDto: CreateUserDto, @Req() req) {
    const userTenantId = req.user.tenantId;
    const isSuperAdmin = req.user.roles?.some(
      (role: any) => role.name === 'super',
    );
    const isAdmin = req.user.roles?.some(
      (role: any) => role.name === 'manager',
    );
    let targetTenantId = userTenantId;

    if (isSuperAdmin) {
      targetTenantId = createUserDto.tenantId; // Super Admin có thể tạo ở bất kỳ tenant
    } else if (isAdmin && createUserDto.tenantId === userTenantId) {
      targetTenantId = createUserDto.tenantId; // Admin chỉ tạo trong tenant của mình
    } else {
      throw new ForbiddenException(
        'You do not have permission to create users for this tenant',
      );
    }

    if (!targetTenantId && !isSuperAdmin) {
      throw new BadRequestException('Tenant ID is required');
    }

    createUserDto.tenant = { id: targetTenantId } as any;
    createUserDto.tenantId = targetTenantId;
    return this.usersService.create(createUserDto, targetTenantId);
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
      (role: any) => role.name === 'super',
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
    const isSuperAdmin = req.user.roles?.some(
      (role: any) => role.name === 'super',
    );

    let targetTenantId = tenantId;

    if (updateUserDto.tenant && isSuperAdmin) {
      const tenant = await this.tenantsService.findOne(updateUserDto.tenant.id);
      if (!tenant) {
        throw new BadRequestException('Tenant does not exist');
      }
      targetTenantId = tenant.id;
    }

    if (!targetTenantId && !isSuperAdmin) {
      throw new BadRequestException('Tenant ID is required');
    }
    return this.usersService.update(+id, updateUserDto, targetTenantId);
  }
}
