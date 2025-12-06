import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio global para manejo de almacenamiento de archivos
 * Centraliza la lógica de guardado, eliminación y gestión de archivos
 */
@Injectable()
export class FileStorageService {
  private readonly avatarPath = './storage/avatars';
  private readonly documentPath = './storage/documents';

  /**
   * Guarda un avatar en el sistema de archivos
   * @param file - Archivo a guardar
   * @returns URL relativa del archivo guardado
   */
  async saveAvatar(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = extname(file.originalname);
      const fileName = `avatar-${uuidv4()}${fileExtension}`;

      // Crear directorio si no existe
      if (!existsSync(this.avatarPath)) {
        mkdirSync(this.avatarPath, { recursive: true });
      }

      const filePath = join(this.avatarPath, fileName);

      // Guardar archivo
      writeFileSync(filePath, file.buffer);

      // Retornar URL relativa
      return `/storage/avatars/${fileName}`;
    } catch (error) {
      Logger.error('Error al guardar archivo de avatar:', error);
      throw new BadRequestException('Error al guardar el archivo de avatar');
    }
  }

  /**
   * Guarda un documento en el sistema de archivos
   * @param file - Archivo a guardar
   * @param subFolder - Subcarpeta opcional dentro de documents
   * @returns URL relativa del archivo guardado
   */
  async saveDocument(file: Express.Multer.File, subFolder?: string): Promise<string> {
    try {
      const fileExtension = extname(file.originalname);
      const fileName = `doc-${uuidv4()}${fileExtension}`;

      const targetPath = subFolder ? join(this.documentPath, subFolder) : this.documentPath;

      // Crear directorio si no existe
      if (!existsSync(targetPath)) {
        mkdirSync(targetPath, { recursive: true });
      }

      const filePath = join(targetPath, fileName);

      // Guardar archivo
      writeFileSync(filePath, file.buffer);

      // Retornar URL relativa
      const relativePath = subFolder
        ? `/storage/documents/${subFolder}/${fileName}`
        : `/storage/documents/${fileName}`;

      return relativePath;
    } catch (error) {
      Logger.error('Error al guardar documento:', error);
      throw new BadRequestException('Error al guardar el documento');
    }
  }

  /**
   * Elimina un archivo de avatar
   * @param fileName - Nombre del archivo a eliminar
   */
  async deleteAvatar(fileName: string): Promise<void> {
    try {
      const filePath = join(this.avatarPath, fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
        Logger.log(`Avatar eliminado: ${fileName}`);
      }
    } catch (error) {
      Logger.error('Error al eliminar archivo de avatar:', error);
    }
  }

  /**
   * Elimina un documento
   * @param filePath - Ruta completa o relativa del archivo
   */
  async deleteDocument(filePath: string): Promise<void> {
    try {
      const fileName = basename(filePath);
      const fullPath = join(this.documentPath, fileName);

      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        Logger.log(`Documento eliminado: ${fileName}`);
      }
    } catch (error) {
      Logger.error('Error al eliminar documento:', error);
    }
  }

  /**
   * Procesa la carga de un avatar (wrapper con manejo de errores)
   * @param file - Archivo opcional a procesar
   * @returns URL del avatar o null si no se proporcionó archivo
   */
  async processAvatarUpload(file?: Express.Multer.File): Promise<string | null> {
    if (!file) return null;

    try {
      return await this.saveAvatar(file);
    } catch (error) {
      Logger.error('Error al procesar avatar:', error);
      throw new BadRequestException('Error al procesar el archivo de avatar');
    }
  }

  /**
   * Extrae la clave S3 de una URL (para futuras implementaciones con S3)
   * @param url - URL del archivo en S3
   * @returns Clave extraída o null
   */
  extractS3KeyFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const keyIndex = urlParts.findIndex((part) => part.includes('.amazonaws.com'));
      if (keyIndex !== -1 && keyIndex < urlParts.length - 1) {
        return urlParts.slice(keyIndex + 1).join('/');
      }
      return null;
    } catch {
      return null;
    }
  }
}
