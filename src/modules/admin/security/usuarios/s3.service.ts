// // s3/s3.service.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as AWS from 'aws-sdk';

// export interface UploadFileParams {
//   buffer: Buffer;
//   filename: string;
//   mimetype: string;
// }

// export interface UploadResult {
//   url: string;
//   key: string;
// }

// @Injectable()
// export class S3Service {
//   private readonly logger = new Logger(S3Service.name);
//   private readonly s3: AWS.S3;
//   private readonly bucketName: string;

//   constructor(private readonly configService: ConfigService) {
//     this.s3 = new AWS.S3({
//       accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
//       secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
//       region: this.configService.get<string>('AWS_REGION'),
//     });

//     this.bucketName = this.configService.get<string>('AWS_S3_BUCKET');
//   }

//   async uploadFile(params: UploadFileParams): Promise<UploadResult> {
//     try {
//       const uploadParams: AWS.S3.PutObjectRequest = {
//         Bucket: this.bucketName,
//         Key: params.filename,
//         Body: params.buffer,
//         ContentType: params.mimetype,
//         ACL: 'public-read', // Si quieres que sea público
//       };

//       const result = await this.s3.upload(uploadParams).promise();

//       this.logger.log(`Archivo subido exitosamente: ${result.Location}`);

//       return {
//         url: result.Location,
//         key: params.filename,
//       };
//     } catch (error) {
//       this.logger.error(`Error al subir archivo: ${error.message}`, error.stack);
//       throw error;
//     }
//   }

//   async deleteFile(key: string): Promise<void> {
//     try {
//       const deleteParams: AWS.S3.DeleteObjectRequest = {
//         Bucket: this.bucketName,
//         Key: key,
//       };

//       await this.s3.deleteObject(deleteParams).promise();
//       this.logger.log(`Archivo eliminado exitosamente: ${key}`);
//     } catch (error) {
//       this.logger.error(`Error al eliminar archivo: ${error.message}`, error.stack);
//       throw error;
//     }
//   }

//   async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
//     try {
//       const params = {
//         Bucket: this.bucketName,
//         Key: key,
//         Expires: expiresIn,
//       };

//       return this.s3.getSignedUrl('getObject', params);
//     } catch (error) {
//       this.logger.error(`Error al generar URL firmada: ${error.message}`, error.stack);
//       throw error;
//     }
//   }
// }
