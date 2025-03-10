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
import { ProductBrandsService } from './product-brands.service';
import { CreateProductBrandDto } from './dtos/create-product-brand.dto';
import { UpdateProductBrandDto } from './dtos/update-product-brand.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('product-brands')
@Controller('product-brands')
export class ProductBrandsController {
  constructor(private brandsService: ProductBrandsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product brand' })
  @ApiResponse({ status: 201, description: 'Brand created' })
  async create(@Body() createDto: CreateProductBrandDto, @Req() req) {
    return this.brandsService.create(createDto, req.user.tenantId, req.user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of product brands' })
  @ApiQuery({ type: PaginationDto })
  async findAll(@Query() pagination: PaginationDto, @Req() req) {
    return this.brandsService.findAll(req.user.tenantId, pagination);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product brand by ID' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.brandsService.findOne(+id, req.user.tenantId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product brand' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductBrandDto,
    @Req() req,
  ) {
    return this.brandsService.update(+id, updateDto, req.user.tenantId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product brand' })
  async remove(@Param('id') id: string, @Req() req) {
    return this.brandsService.remove(+id, req.user.tenantId);
  }
}
