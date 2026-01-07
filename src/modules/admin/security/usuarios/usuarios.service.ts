import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  ResetPasswordDto,
  CreateUsuarioDto,
  ListUsuarioArgsDto,
  UpdateUsuarioDto,
} from './dto/usuarios.input.dto';
import { PrismaService } from 'src/global/database/prisma.service';
import {
  dataErrorValidations,
  dataResponseError,
  dataResponseSuccess,
} from 'src/common/dtos/response.dto';
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
import { IToken } from 'src/common/decorators/token.decorator';
import { AuditService } from 'src/global/services/audit.service';

@Injectable()
export class UsuariosService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
    private readonly profileService: ProfileService,
    private readonly fileStorageService: FileStorageService,
    private readonly userValidationService: UserValidationService,
    private readonly auditService: AuditService,
  ) {}

  async create(inputDto: CreateUsuarioDto, file?: Express.Multer.File) {
    try {
      const { rolesIds, password, ...usuarioData } = inputDto;

      // 1. Validaciones usando UserValidationService
      const isEmailUnique = await this.userValidationService.isEmailUnique(usuarioData.email);
      if (!isEmailUnique) {
        return dataErrorValidations({ email: ['El email ya está registrado'] });
      }

      const areRolesValid = await this.userValidationService.doRolesExist(rolesIds);
      if (!areRolesValid) {
        return dataErrorValidations({ rolesIds: ['Uno o más roles no existen'] });
      }

      // Validar sucursal si se proporciona
      if (usuarioData.sucursalId) {
        const sucursalExists = await this.prismaService.sucursal.findUnique({
          where: { id: usuarioData.sucursalId },
          select: { id: true },
        });
        if (!sucursalExists) {
          return dataErrorValidations({ sucursalId: ['La sucursal no existe'] });
        }
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

  async getForSelect() {
    const list = await this.prismaService.usuario.findMany({
      where: { estaActivo: true },
      select: {
        id: true,
        nombre: true,
        apellidos: true,
        email: true,
        avatar: true,
      },
      orderBy: { nombre: 'asc' },
    });

    return dataResponseSuccess({
      data: list,
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
      include: {
        roles: { include: { rol: true } },
        sucursal: {
          select: {
            id: true,
            nombre: true,
            abreviacion: true,
            departamento: true,
          },
        },
      },
    });
    if (!usuario) return dataResponseError('Usuario no encontrado');

    // Remover contraseña de la respuesta
    const { password, ...usuarioSinPassword } = usuario;
    return dataResponseSuccess<Usuario>({ data: usuarioSinPassword });
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto, session: IToken) {
    try {
      // Verificar que el usuario existe y obtener datos completos para auditoría
      const existingUsuario = await this.prismaService.usuario.findUnique({
        where: { id },
        include: {
          roles: {
            include: {
              rol: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
        },
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

      // Validar sucursal si se proporciona
      if (usuarioData.sucursalId) {
        const sucursalExists = await this.prismaService.sucursal.findUnique({
          where: { id: usuarioData.sucursalId },
          select: { id: true },
        });
        if (!sucursalExists) {
          return dataErrorValidations({ sucursalId: ['La sucursal no existe'] });
        }
      }

      // Preparar los datos de actualización
      const updateData: any = { ...usuarioData };

      // Encriptar la contraseña si se proporciona
      if (password) {
        updateData.password = await hash(password, 10);
      }

      // Guardar información de roles para auditoría y log
      let rolesLog = '';
      if (rolesIds !== undefined) {
        const rolesAnteriores = existingUsuario.roles.map((ur) => ur.rol.nombre).sort();
        const rolesNuevos =
          rolesIds.length > 0
            ? await this.prismaService.rol
                .findMany({
                  where: { id: { in: rolesIds } },
                  select: { nombre: true },
                })
                .then((roles) => roles.map((r) => r.nombre).sort())
            : [];

        rolesLog = `Roles anteriores: [${rolesAnteriores.join(', ') || 'Sin roles'}] → Roles nuevos: [${rolesNuevos.join(', ') || 'Sin roles'}]`;

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

      // Registrar cambios detallados usando AuditService.registrarCambiosDetallados
      // Preparar datos anteriores y nuevos para comparación
      const datosAnteriores = {
        email: existingUsuario.email,
        nombre: existingUsuario.nombre,
        apellidos: existingUsuario.apellidos,
        telefono: existingUsuario.telefono,
        direccion: existingUsuario.direccion,
        estaActivo: existingUsuario.estaActivo,
        emailVerificado: existingUsuario.emailVerificado,
        roles: existingUsuario.roles.map((ur) => ur.rol.nombre).sort(),
      };

      const datosNuevos = {
        email: result.email,
        nombre: result.nombre,
        apellidos: result.apellidos,
        telefono: result.telefono,
        direccion: result.direccion,
        estaActivo: result.estaActivo,
        emailVerificado: result.emailVerificado,
        roles: result.roles.map((ur) => ur.rol.nombre).sort(),
      };

      await this.auditService.registrarCambiosDetallados(
        'Usuario',
        id,
        datosAnteriores,
        datosNuevos,
        session.usuarioId,
        undefined, // usuarioEmail
        session.nombreCompleto,
        undefined, // ipOrigen
      );

      // Remover contraseña de la respuesta
      const { password: _, ...usuarioSinPassword } = result;

      // Log con información de roles si se actualizaron
      if (rolesLog) {
        Logger.log(`Usuario actualizado: ${usuarioSinPassword.email} - ${rolesLog}`);
      } else {
        Logger.log(`Usuario actualizado exitosamente: ${usuarioSinPassword.email}`);
      }

      return dataResponseSuccess<Usuario>({ data: usuarioSinPassword });
    } catch (error) {
      Logger.error('Error al actualizar usuario:', error);

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
