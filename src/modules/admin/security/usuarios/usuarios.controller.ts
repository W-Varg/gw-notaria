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
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateUsuariosType,
  ResponseUsuarioType,
  ResponseUsuarioDetailType,
  ResponseUsuariosType,
} from './dto/usuarios.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';

@ApiTags('[auth] Usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.USUARIOS_CREAR])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiDescription('Crear un nuevo usuario', [PermisoEnum.USUARIOS_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  create(@Body() inputDto: CreateUsuarioDto, @UploadedFile() avatar?: Express.Multer.File) {
    return this.usuariosService.create(inputDto, avatar);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.USUARIOS_VER])
  @ApiDescription('Listar todos los usuarios', [PermisoEnum.USUARIOS_VER])
  @ApiResponse({ type: ResponseUsuariosType })
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
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.USUARIOS_EDITAR])
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  @ApiDescription('Actualizar un usuario por ID', [PermisoEnum.USUARIOS_EDITAR])
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto, avatar);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.USUARIOS_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  @ApiDescription('Eliminar un usuario por ID', [PermisoEnum.USUARIOS_ELIMINAR])
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }

  @Post(':id/change-password')
  @BearerAuthPermision([PermisoEnum.USUARIOS_EDITAR_CONTRASENIA])
  @ApiDescription('Cambiar contraseña de un usuario', [PermisoEnum.USUARIOS_EDITAR_CONTRASENIA])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  changePassword(@Param('id') id: string, @Body() inputDto: ResetPasswordDto) {
    return this.usuariosService.changePassword(id, inputDto);
  }

  @Post(':id/send-verification-code')
  @BearerAuthPermision([PermisoEnum.USUARIOS_EDITAR])
  @ApiDescription('Enviar código de verificación a un usuario', [PermisoEnum.USUARIOS_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseUsuarioType })
  sendVerificationCode(@Param('id') id: string) {
    return this.usuariosService.sendVerificationCode(id);
  }
}
