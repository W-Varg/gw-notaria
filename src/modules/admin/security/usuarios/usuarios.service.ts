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
import { basename } from 'node:path';
import { hash } from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';
import { ProfileService } from 'src/modules/auth/profile/profile.service';
import { FileStorageService } from 'src/global/services/file-storage.service';
import { UserValidationService } from 'src/global/services/user-validation.service';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly fileStorageService: FileStorageService,
    private readonly userValidationService: UserValidationService,
  ) {}

  async create(inputDto: CreateUsuarioDto, file?: Express.Multer.File) {
    try {
      const { rolesIds, password, ...usuarioData } = inputDto;

      // 1. Validaciones usando UserValidationService
      const isEmailUnique = await this.userValidationService.isEmailUnique(usuarioData.email);
      if (!isEmailUnique) {
        return dataResponseError('El email ya está registrado');
      }

      const areRolesValid = await this.userValidationService.doRolesExist(rolesIds);
      if (!areRolesValid) {
        return dataResponseError('Uno o más roles no existen');
      }

      // 2. Procesar avatar usando FileStorageService
      const avatarUrl = await this.fileStorageService.processAvatarUpload(file);

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

      // Cleanup: eliminar avatar si hubo error usando FileStorageService
      if (file && error instanceof Error) {
        try {
          const fileName = basename(file.originalname);
          await this.fileStorageService.deleteAvatar(fileName);
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

      // Verificar que el email no esté en uso por otro usuario usando UserValidationService
      if (usuarioData.email) {
        const isEmailUnique = await this.userValidationService.isEmailUnique(usuarioData.email, id);
        if (!isEmailUnique) {
          return dataResponseError('El email ya está en uso por otro usuario');
        }
      }

      // Verificar que los roles existan si se proporcionan usando UserValidationService
      if (rolesIds && rolesIds.length > 0) {
        const areRolesValid = await this.userValidationService.doRolesExist(rolesIds);
        if (!areRolesValid) {
          return dataResponseError('No existen los roles indicados');
        }
      }

      // Procesar nuevo avatar si se proporciona usando FileStorageService
      let newAvatarUrl: string | null = null;
      if (file) {
        newAvatarUrl = await this.fileStorageService.processAvatarUpload(file);

        // Eliminar avatar anterior si existe y se está reemplazando
        if (existingUsuario.avatar && newAvatarUrl) {
          const oldFileName = basename(existingUsuario.avatar);
          await this.fileStorageService.deleteAvatar(oldFileName);
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

      // Cleanup: eliminar nuevo avatar si hubo error usando FileStorageService
      if (file && error instanceof Error) {
        try {
          const fileName = basename(file.originalname);
          await this.fileStorageService.deleteAvatar(fileName);
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

    // Usar el servicio de perfil para enviar el código de verificación
    const result = await this.profileService.sendVerificationLink(id);

    return result;
  }
}
