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
import { ProductAttributesService } from './product-attributes.service';
import { CreateProductAttributeDto } from './dtos/create-product-attribute.dto';
import { UpdateProductAttributeDto } from './dtos/update-product-attribute.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('product-attributes')
@Controller('product-attributes')
export class ProductAttributesController {
  constructor(private attributesService: ProductAttributesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product attribute' })
  @ApiResponse({ status: 201, description: 'Attribute created' })
  async create(@Body() createDto: CreateProductAttributeDto, @Req() req) {
    return this.attributesService.create(
      createDto,
      req.user.tenantId,
      req.user,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of product attributes' })
  @ApiQuery({ type: PaginationDto })
  async findAll(@Query() pagination: PaginationDto, @Req() req) {
    return this.attributesService.findAll(req.user.tenantId, pagination);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product attribute by ID' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.attributesService.findOne(+id, req.user.tenantId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product attribute' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductAttributeDto,
    @Req() req,
  ) {
    return this.attributesService.update(+id, updateDto, req.user.tenantId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product attribute' })
  async remove(@Param('id') id: string, @Req() req) {
    return this.attributesService.remove(+id, req.user.tenantId);
  }
}
