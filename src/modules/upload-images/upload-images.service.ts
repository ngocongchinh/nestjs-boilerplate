import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadedImage } from './upload-images.entity';
import { User } from '../users/users.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UploadImagesService {
  constructor(
    @InjectRepository(UploadedImage)
    private imagesRepository: Repository<UploadedImage>,
  ) {}

  async upload(
    file: Express.Multer.File,
    tenantId: number,
    createdBy: User,
  ): Promise<UploadedImage> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadPath = path.join(__dirname, '..', '..', 'uploads', fileName);
    fs.writeFileSync(uploadPath, file.buffer); // Lưu file vào thư mục uploads

    const src = `/uploads/${fileName}`; // URL công khai của ảnh
    const image = this.imagesRepository.create({ src, tenantId, createdBy });
    return this.imagesRepository.save(image);
  }
}
