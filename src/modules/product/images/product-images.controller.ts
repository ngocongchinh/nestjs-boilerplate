import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('product-images')
@Controller('product-images')
export class ProductImagesController {
  constructor(private imagesService: ProductImagesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload a product image' })
  @ApiResponse({ status: 201, description: 'Image uploaded' })
  async create(
    @Body('src') src: string,
    @Body('productId') productId: number,
    @Req() req,
  ) {
    return this.imagesService.create(
      src,
      productId,
      req.user.tenantId,
      req.user,
    );
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of product images' })
  @ApiQuery({ name: 'productId', required: true })
  @ApiQuery({ type: PaginationDto })
  async findAll(
    @Query('productId') productId: string,
    @Query() pagination: PaginationDto,
    @Req() req,
  ) {
    return this.imagesService.findAll(
      +productId,
      req.user.tenantId,
      pagination,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product image' })
  async remove(@Param('id') id: string, @Req() req) {
    return this.imagesService.remove(+id, req.user.tenantId);
  }
}
