import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new permission (super role only)' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only super users can create permissions',
  })
  async create(@Body() createPermissionDto: CreatePermissionDto, @Req() req) {
    const userRole = req.user.roles?.some((role) => role.name === 'super')
      ? 'super'
      : '';
    return this.permissionsService.create(createPermissionDto, userRole);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a permission (super role only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Permission ID' })
  @ApiBody({ type: UpdatePermissionDto })
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only super users can update permissions',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Req() req,
  ) {
    const userRole = req.user.roles?.some((role) => role.name === 'super')
      ? 'super'
      : '';
    return this.permissionsService.update(id, updatePermissionDto, userRole);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a permission (super role only)' })
  @ApiParam({ name: 'id', type: Number, description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Only super users can delete permissions',
  })
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userRole = req.user.roles?.some((role) => role.name === 'super')
      ? 'super'
      : '';
    await this.permissionsService.delete(id, userRole);
    return { message: 'Permission deleted successfully' };
  }
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'List of permissions retrieved' })
  async findAll(@Query() pagination: PaginationDto) {
    return this.permissionsService.findAll(pagination);
  }
  @Get('by-role')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get permissions by logged-in user roles' })
  @ApiResponse({
    status: 200,
    description: 'List of permissions retrieved based on user roles',
  })
  async findByUserRoles(@Req() req) {
    return this.permissionsService.findByUserRoles(req.user.roles);
  }
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get permission detail by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission detail retrieved' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id);
  }
}
