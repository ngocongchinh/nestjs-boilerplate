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
import { ProductCategoriesService } from './product-categories.service';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('product-categories')
@Controller('product-categories')
export class ProductCategoriesController {
  constructor(private categoriesService: ProductCategoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiResponse({ status: 201, description: 'Category created' })
  async create(@Body() createDto: CreateProductCategoryDto, @Req() req) {
    return this.categoriesService.create(
      createDto,
      req.user.tenantId,
      req.user,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of product categories' })
  @ApiQuery({ type: PaginationDto })
  async findAll(@Query() pagination: PaginationDto, @Req() req) {
    return this.categoriesService.findAll(req.user.tenantId, pagination);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product category by ID' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.categoriesService.findOne(+id, req.user.tenantId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product category' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductCategoryDto,
    @Req() req,
  ) {
    return this.categoriesService.update(+id, updateDto, req.user.tenantId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product category' })
  async remove(@Param('id') id: string, @Req() req) {
    return this.categoriesService.remove(+id, req.user.tenantId);
  }
}
