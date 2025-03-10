import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadImagesService } from './upload-images.service';
import { UploadImagesController } from './upload-images.controller';
import { UploadedImage } from './upload-images.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UploadedImage])],
  providers: [UploadImagesService],
  controllers: [UploadImagesController],
  exports: [UploadImagesService],
})
export class UploadImagesModule {}
