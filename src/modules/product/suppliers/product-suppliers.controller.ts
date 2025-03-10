import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ProductSuppliersService } from './product-suppliers.service';
import { CreateProductSupplierDto } from './dtos/create-product-supplier.dto';
import { UpdateProductSupplierDto } from './dtos/update-product-supplier.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('product-suppliers')
@Controller('product-suppliers')
export class ProductSuppliersController {
  constructor(private suppliersService: ProductSuppliersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product supplier' })
  @ApiResponse({ status: 201, description: 'Supplier created' })
  async create(@Body() createDto: CreateProductSupplierDto, @Req() req) {
    return this.suppliersService.create(createDto, req.user.tenantId, req.user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of product suppliers' })
  @ApiQuery({ type: PaginationDto })
  async findAll(@Query() pagination: PaginationDto, @Req() req) {
    return this.suppliersService.findAll(req.user.tenantId, pagination);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product supplier by ID' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.suppliersService.findOne(+id, req.user.tenantId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product supplier' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductSupplierDto,
    @Req() req,
  ) {
    return this.suppliersService.update(+id, updateDto, req.user.tenantId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product supplier' })
  async remove(@Param('id') id: string, @Req() req) {
    return this.suppliersService.remove(+id, req.user.tenantId);
  }
}
