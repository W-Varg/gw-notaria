import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsuariosService } from './usuarios.service';
import {
  CreateUsuarioDto,
  ListUsuarioArgsDto,
  ResetPasswordDto,
  UpdateUsuarioDto,
} from './dto/usuarios.input.dto';
import { ApiDescription } from '../../../../common/decorators/controller.decorator';
import { PermisoEnum } from '../../../../enums/permisos.enum';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateUsuariosType,
  ResponseUsuarioType,
  ResponseUsuarioDetailType,
  ResponseUsuariosType,
} from './dto/usuarios.response';
import { BearerAuthPermision } from '../../../../common/decorators/authorization.decorator';
import { CommonParamsDto } from '../../../../common/dtos/common-params.dto';
import { ListFindAllQueryDto } from '../../../../common/dtos/filters.dto';
import { Audit } from '../../../../common/decorators/audit.decorator';
import { AuditInterceptor } from '../../../../common/interceptors/audit.interceptor';
import { TipoAccionEnum } from '../../../../enums/tipo-accion.enum';
import { AuthUser, IToken } from '../../../../common/decorators/token.decorator';

@ApiTags('[auth] Usuarios')
@Controller('usuarios')
@UseInterceptors(AuditInterceptor)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.USUARIOS_CREAR])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiDescription('Crear un nuevo usuario', [PermisoEnum.USUARIOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'usuarios',
    tabla: 'Usuario',
    descripcion: 'Crear nuevo usuario',
  })
  create(@Body() inputDto: CreateUsuarioDto, @UploadedFile() avatar?: Express.Multer.File) {
    return this.usuariosService.create(inputDto, avatar);
  }

  @Get('select')
  @BearerAuthPermision([PermisoEnum.USUARIOS_VER])
  @ApiDescription('Obtener usuarios para select', [PermisoEnum.USUARIOS_VER])
  @ApiResponse({ status: 200, type: ResponseUsuariosType })
  getForSelect() {
    return this.usuariosService.getForSelect();
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.USUARIOS_VER])
  @ApiDescription('Listar todos los usuarios', [PermisoEnum.USUARIOS_VER])
  @ApiResponse({ status: 200, type: ResponseUsuariosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.usuariosService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.USUARIOS_VER])
  @ApiDescription('Servicio POST con filtros y paginado de usuarios', [PermisoEnum.USUARIOS_VER])
  @ApiResponse({ status: 200, type: () => PaginateUsuariosType })
  list(@Body() inputDto: ListUsuarioArgsDto) {
    return this.usuariosService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.USUARIOS_VER])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioDetailType })
  @ApiDescription('Obtener un usuario por ID', [PermisoEnum.USUARIOS_VER])
  findOne(@Param() params: CommonParamsDto.IdCuid) {
    return this.usuariosService.findOne(params.id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.USUARIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  @ApiDescription('Actualizar un usuario por ID', [PermisoEnum.USUARIOS_EDITAR])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'usuarios',
    tabla: 'Usuario',
    descripcion: 'Actualizar usuario',
  })
  update(
    @Param() params: CommonParamsDto.IdCuid,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @AuthUser() session: IToken,
  ) {
    return this.usuariosService.update(params.id, updateUsuarioDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.USUARIOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  @ApiDescription('Eliminar un usuario por ID', [PermisoEnum.USUARIOS_ELIMINAR])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'usuarios',
    tabla: 'Usuario',
    descripcion: 'Eliminar usuario',
  })
  remove(@Param() params: CommonParamsDto.IdCuid) {
    return this.usuariosService.delete(params.id);
  }

  @Post(':id/change-password')
  @BearerAuthPermision([PermisoEnum.USUARIOS_EDITAR_CONTRASENIA])
  @ApiDescription('Cambiar contraseña de un usuario', [PermisoEnum.USUARIOS_EDITAR_CONTRASENIA])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  @Audit({
    accion: TipoAccionEnum.PASSWORD_CHANGE,
    modulo: 'usuarios',
    tabla: 'Usuario',
    descripcion: 'Cambiar contraseña de usuario',
  })
  changePassword(@Param() params: CommonParamsDto.IdCuid, @Body() inputDto: ResetPasswordDto) {
    return this.usuariosService.changePassword(params.id, inputDto);
  }

  @Post(':id/send-verification-code')
  @BearerAuthPermision([PermisoEnum.USUARIOS_EDITAR])
  @ApiDescription('Enviar código de verificación a un usuario', [PermisoEnum.USUARIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  sendVerificationCode(@Param() params: CommonParamsDto.IdCuid) {
    return this.usuariosService.sendVerificationCode(params.id);
  }
}
