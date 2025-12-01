import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  ResetPasswordDto,
  CreateUsuarioDto,
  ListUsuarioArgsDto,
  UpdateUsuarioDto,
} from './dto/usuarios.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import { dataResponseError, dataResponseSuccess } from 'src/common/dtos/response.dto';
import { Prisma } from 'src/generated/prisma/client';
import { Usuario } from './usuario.entity';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { paginationParamsFormat } from 'src/helpers/prisma.helper';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, extname, join } from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class UsuariosService {
  private readonly uploadPath = './storage/avatars';

  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  private async saveAvatar(file: Express.Multer.File): Promise<string> {
    try {
      const fileExtension = extname(file.originalname);
      const fileName = `avatar-${uuidv4()}${fileExtension}`;
      // si no existe la ruta uploadPath crear entonces
      if (!existsSync(this.uploadPath)) {
        mkdirSync(this.uploadPath, { recursive: true });
      }
      const filePath = join(this.uploadPath, fileName);

      // Guardar archivo
      writeFileSync(filePath, file.buffer);

      // Retornar URL relativa
      return `/storage/avatars/${fileName}`;
    } catch (error) {
      Logger.error('Error al guardar archivo de avatar:', error);
      throw new BadRequestException('Error al guardar el archivo de avatar');
    }
  }

  private async deleteAvatarFile(fileName: string): Promise<void> {
    try {
      const filePath = join(this.uploadPath, fileName);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    } catch (error) {
      console.error('Error al eliminar archivo de avatar:', error);
    }
  }

  // private async uploadToS3(file: Express.Multer.File): Promise<string> {
  //   const fileName = `avatars/avatar-${uuidv4()}${extname(file.originalname)}`;

  //   const uploadParams = {
  //     Bucket: process.env.AWS_S3_BUCKET,
  //     Key: fileName,
  //     Body: file.buffer,
  //     ContentType: file.mimetype,
  //   };

  //   // TODO: Implement S3 upload when configured
  //   return 'result.Location';
  // }

  // private async deleteAvatarFromS3(fileUrl: string): Promise<void> {
  //   try {
  //     const key = this.extractS3KeyFromUrl(fileUrl);
  //     if (key) {
  //       // TODO: Implement S3 delete when configured
  //       Logger.log(`S3 delete pending for key: ${key}`);
  //     }
  //   } catch (error) {
  //     Logger.error('Error al eliminar archivo de S3:', error);
  //   }
  // }

  private extractS3KeyFromUrl(url: string): string | null {
    // Ejemplo: https://bucket.s3.region.amazonaws.com/avatars/avatar-123.jpg
    // Extraer: avatars/avatar-123.jpg
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

  private async validateEmailUniqueness(email: string): Promise<boolean> {
    const existingUsuario = await this.prismaService.usuario.findUnique({
      where: { email },
      select: { id: true },
    });
    return !existingUsuario;
  }

  private async validateRolesExist(rolesIds: number[]): Promise<boolean> {
    if (!rolesIds || rolesIds.length === 0) return true;

    const rolesExist = await this.prismaService.rol.findMany({
      where: { id: { in: rolesIds } },
      select: { id: true },
    });

    return rolesExist.length === rolesIds.length;
  }

  private async processAvatarUpload(file?: Express.Multer.File): Promise<string | null> {
    if (!file) return null;

    try {
      return await this.saveAvatar(file);
    } catch (error) {
      Logger.error('Error al guardar avatar:', error);
      throw new BadRequestException('Error al procesar el archivo de avatar');
    }
  }

  async create(inputDto: CreateUsuarioDto, file?: Express.Multer.File) {
    try {
      const { rolesIds, password, ...usuarioData } = inputDto;

      // 1. Validaciones
      const isEmailUnique = await this.validateEmailUniqueness(usuarioData.email);
      if (!isEmailUnique) {
        return dataResponseError('El email ya está registrado');
      }

      const areRolesValid = await this.validateRolesExist(rolesIds);
      if (!areRolesValid) {
        return dataResponseError('Uno o más roles no existen');
      }

      // 2. Procesar avatar
      const avatarUrl = await this.processAvatarUpload(file);

      // 3. Encriptar contraseña
      const hashedPassword = await hash(password, 10);

      // 4. Preparar datos para creación
      const dataInput: Prisma.UsuarioCreateInput = {
        ...usuarioData,
        password: hashedPassword,
        avatar: avatarUrl,
        estaActivo: usuarioData.estaActivo ?? true,
        emailVerificado: false,
      };

      // 5. Agregar roles si existen
      if (rolesIds && rolesIds.length > 0) {
        dataInput.roles = {
          create: rolesIds.map((rolId) => ({
            rol: { connect: { id: rolId } },
          })),
        };
      }

      // 6. Crear usuario
      const result = await this.prismaService.usuario.create({
        data: dataInput,
        include: {
          roles: {
            include: {
              rol: {
                select: {
                  id: true,
                  nombre: true,
                  descripcion: true,
                },
              },
            },
          },
        },
      });

      // 7. Remover contraseña de la respuesta
      const { password: _, ...usuarioSinPassword } = result;

      Logger.log(`Usuario creado exitosamente: ${usuarioSinPassword.email}`);

      return dataResponseSuccess<Usuario>({ data: usuarioSinPassword });
    } catch (error) {
      Logger.error('Error al crear usuario:', error);

      // Cleanup: eliminar avatar si hubo error
      if (file) {
        try {
          const fileName = basename(file.originalname);
          await this.deleteAvatarFile(fileName);
        } catch (cleanupError) {
          Logger.error('Error al limpiar archivo de avatar:', cleanupError);
        }
      }

      return dataResponseError('Error al crear el usuario. Por favor intente nuevamente.');
    }
  }

  async findAll(query?: ListFindAllQueryDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(query);

    // Ejecutar queries en paralelo cuando sea necesario
    const [list, total] = await Promise.all([
      this.prismaService.usuario.findMany({
        skip,
        take,
        orderBy,
      }),
      pagination ? this.prismaService.usuario.count() : Promise.resolve(undefined),
    ]);

    if (pagination && total !== undefined) pagination.total = total;

    return dataResponseSuccess<Usuario[]>({
      data: list,
      pagination,
    });
  }

  async filter(inputDto: ListUsuarioArgsDto) {
    const { skip, take, orderBy, pagination } = paginationParamsFormat(inputDto, true);
    const { email, nombre, estaActivo, apellidos, telefono, direccion, emailVerificado } =
      inputDto?.where || {};
    const whereInput: Prisma.UsuarioWhereInput = {};

    if (email) whereInput.email = email;
    if (nombre) whereInput.nombre = nombre;
    if (apellidos) whereInput.apellidos = apellidos;
    if (telefono) whereInput.telefono = telefono;
    if (direccion) whereInput.direccion = direccion;
    if (estaActivo !== undefined) whereInput.estaActivo = estaActivo;
    if (emailVerificado !== undefined) whereInput.emailVerificado = emailVerificado;

    const [list, total] = await Promise.all([
      this.prismaService.usuario.findMany({
        where: whereInput,
        skip,
        take,
        orderBy,
      }),
      this.prismaService.usuario.count({ where: whereInput }),
    ]);

    // Remover contraseñas de la respuesta
    const sanitized = list.map(({ password, ...usuario }) => usuario);
    return dataResponseSuccess<Usuario[]>({
      data: sanitized,
      pagination: { ...pagination, total },
    });
  }

  async findOne(id: string) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id },
      include: { roles: { include: { rol: true } } },
    });
    if (!usuario) return dataResponseError('Usuario no encontrado');

    // Remover contraseña de la respuesta
    const { password, ...usuarioSinPassword } = usuario;
    return dataResponseSuccess<Usuario>({ data: usuarioSinPassword });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto, file?: Express.Multer.File) {
    try {
      // Verificar que el usuario existe y obtener avatar actual
      const existingUsuario = await this.prismaService.usuario.findUnique({
        where: { id },
        select: { id: true, avatar: true },
      });

      if (!existingUsuario) return dataResponseError('Usuario no encontrado');

      const { rolesIds, password, ...usuarioData } = updateUsuarioDto;

      // Verificar que el email no esté en uso por otro usuario
      if (usuarioData.email) {
        const emailExists = await this.prismaService.usuario.findFirst({
          where: {
            email: usuarioData.email,
            id: { not: id },
          },
          select: { id: true },
        });

        if (emailExists) {
          return dataResponseError('El email ya está en uso por otro usuario');
        }
      }

      // Verificar que los roles existan si se proporcionan
      if (rolesIds && rolesIds.length > 0) {
        const rolesExist = await this.prismaService.rol.findMany({
          where: { id: { in: rolesIds } },
          select: { id: true },
        });

        if (rolesExist.length !== rolesIds.length) {
          return dataResponseError('No existen los roles indicados');
        }
      }

      // Procesar nuevo avatar si se proporciona
      let newAvatarUrl: string | null = null;
      if (file) {
        newAvatarUrl = await this.processAvatarUpload(file);

        // Eliminar avatar anterior si existe y se está reemplazando
        if (existingUsuario.avatar && newAvatarUrl) {
          const oldFileName = basename(existingUsuario.avatar);
          await this.deleteAvatarFile(oldFileName);
        }
      }

      // Preparar los datos de actualización
      const updateData: any = { ...usuarioData };

      // Agregar nuevo avatar si se procesó
      if (newAvatarUrl) {
        updateData.avatar = newAvatarUrl;
      }

      // Encriptar la contraseña si se proporciona
      if (password) {
        updateData.password = await hash(password, 10);
      }

      // Actualizar roles si se proporcionan
      if (rolesIds !== undefined) {
        updateData.roles = {
          deleteMany: {},
          create: rolesIds.map((rolId) => ({
            rol: { connect: { id: rolId } },
          })),
        };
      }

      const result = await this.prismaService.usuario.update({
        where: { id },
        data: updateData,
        include: { roles: { include: { rol: true } } },
      });

      // Remover contraseña de la respuesta
      const { password: _, ...usuarioSinPassword } = result;

      Logger.log(`Usuario actualizado exitosamente: ${usuarioSinPassword.email}`);

      return dataResponseSuccess<Usuario>({ data: usuarioSinPassword });
    } catch (error) {
      Logger.error('Error al actualizar usuario:', error);

      // Cleanup: eliminar nuevo avatar si hubo error
      if (file) {
        try {
          const fileName = basename(file.originalname);
          await this.deleteAvatarFile(fileName);
        } catch (cleanupError) {
          Logger.error('Error al limpiar archivo de avatar:', cleanupError);
        }
      }

      return dataResponseError('Error al actualizar el usuario. Por favor intente nuevamente.');
    }
  }

  async delete(id: string) {
    // Verificar si el usuario tiene relaciones que impiden su eliminación
    const hasMessages = await this.prismaService.mensajeContacto.count({
      where: { usuarioId: id },
    });

    if (hasMessages > 0) {
      return dataResponseError('El usuario tiene mensajes de contacto y no puede ser eliminado');
    }

    const existingUsuario = await this.prismaService.usuario.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUsuario) return dataResponseError('Usuario no encontrado');

    return this.prismaService.usuario.delete({ where: { id } });
  }

  async findByEmail(email: string) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            rol: {
              include: {
                rolPermisos: {
                  include: {
                    permiso: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return usuario;
  }

  async changePassword(id: string, { nuevoPassword }: ResetPasswordDto) {
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!usuario) {
      return dataResponseError('Usuario no encontrado');
    }

    const hashedPassword = await hash(nuevoPassword, 10);

    await this.prismaService.usuario.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return dataResponseSuccess(
      { data: { id: usuario.id } },
      { message: 'Contraseña actualizada correctamente' },
    );
  }

  async resetPassword(id: string) {
    // Verificar que el usuario existe
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id },
      select: { id: true, email: true, nombre: true },
    });

    if (!usuario) {
      return dataResponseError('Usuario no encontrado');
    }

    // Usar el servicio de autenticación para generar un token de reseteo
    const result = await this.authService.forgotPassword({ email: usuario.email });

    return result;
  }

  async sendVerificationCode(id: string) {
    // Verificar que el usuario existe
    const usuario = await this.prismaService.usuario.findUnique({
      where: { id },
      select: { id: true, email: true, emailVerificado: true },
    });

    if (!usuario) {
      return dataResponseError('Usuario no encontrado');
    }

    if (usuario.emailVerificado) {
      return dataResponseError('El email ya está verificado');
    }

    // Usar el servicio de autenticación para enviar el código de verificación
    const result = await this.authService.sendVerificationLink(id);

    return result;
  }
}
