import {
  Controller,
  Post,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadImagesService } from './upload-images.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';

@ApiTags('upload-images')
@Controller('upload-images')
export class UploadImagesController {
  constructor(private uploadImagesService: UploadImagesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Image uploaded', type: Object })
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req) {
    const image = await this.uploadImagesService.upload(
      file,
      req.user.tenantId,
      req.user,
    );
    return { url: image.src }; // Trả về URL của ảnh
  }
}
