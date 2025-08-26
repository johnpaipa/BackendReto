import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = Cloudinary.uploader.upload_stream(
        { folder: 'cursos' },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No se recibió respuesta de Cloudinary'));
          resolve(result);
        },
      );
      Readable.from(file.buffer).pipe(upload);
    });
  }
}
