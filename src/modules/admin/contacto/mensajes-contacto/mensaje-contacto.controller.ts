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
} from '@nestjs/common';
import { AuthUser, IToken } from 'src/common/decorators/token.decorator';
import { MensajeContactoService } from './mensaje-contacto.service';
import {
  CreateMensajeContactoDto,
  UpdateMensajeContactoDto,
  ListMensajeContactoArgsDto,
} from './dto/mensaje-contacto.input.dto';
import { ApiDescription } from 'src/common/decorators/controller.decorator';
import { PermisoEnum } from 'src/enums/permisos.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginateMensajesContactoType,
  ResponseMensajeContactoType,
  ResponseMensajeContactoDetailType,
  ResponseMensajesContactoType,
} from './dto/mensaje-contacto.response';
import { BearerAuthPermision } from 'src/common/decorators/authorization.decorator';
import { ListFindAllQueryDto } from 'src/common/dtos/filters.dto';
import { Audit } from 'src/common/decorators/audit.decorator';
import { AuditInterceptor } from 'src/common/interceptors/audit.interceptor';
import { TipoAccionEnum } from 'src/enums/tipo-accion.enum';

@ApiTags('[admin] Mensajes de Contacto')
@Controller('mensajes-contacto')
@UseInterceptors(AuditInterceptor)
export class MensajeContactoController {
  constructor(private readonly mensajeContactoService: MensajeContactoService) {}

  @Post()
  @BearerAuthPermision([PermisoEnum.MENSAJES_CONTACTO_CREAR])
  @ApiDescription('Registrar un nuevo mensaje de contacto', [PermisoEnum.MENSAJES_CONTACTO_CREAR])
  @ApiResponse({ status: 200, type: () => ResponseMensajeContactoType })
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'contacto',
    tabla: 'MensajeContacto',
    descripcion: 'Registrar nuevo mensaje de contacto',
  })
  create(@Body() inputDto: CreateMensajeContactoDto, @AuthUser() session: IToken) {
    return this.mensajeContactoService.create(inputDto, session);
  }

  @Get()
  @BearerAuthPermision([PermisoEnum.MENSAJES_CONTACTO_VER])
  @ApiDescription('Listar todos los mensajes de contacto', [PermisoEnum.MENSAJES_CONTACTO_VER])
  @ApiResponse({ status: 200, type: ResponseMensajesContactoType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.mensajeContactoService.findAll(query);
  }

  @Post('list')
  @BearerAuthPermision([PermisoEnum.MENSAJES_CONTACTO_VER])
  @ApiDescription('Servicio post con filtros y paginado de mensajes de contacto', [
    PermisoEnum.MENSAJES_CONTACTO_VER,
  ])
  @ApiResponse({ status: 200, type: () => PaginateMensajesContactoType })
  list(@Body() inputDto: ListMensajeContactoArgsDto) {
    return this.mensajeContactoService.filter(inputDto);
  }

  @Get(':id')
  @BearerAuthPermision([PermisoEnum.MENSAJES_CONTACTO_VER])
  @ApiResponse({ status: 200, type: () => ResponseMensajeContactoDetailType })
  @ApiDescription('Obtener un mensaje de contacto por ID', [PermisoEnum.MENSAJES_CONTACTO_VER])
  findOne(@Param('id') id: string) {
    return this.mensajeContactoService.findOne(id);
  }

  @Patch(':id')
  @BearerAuthPermision([PermisoEnum.MENSAJES_CONTACTO_EDITAR])
  @ApiResponse({ status: 200, type: () => ResponseMensajeContactoType })
  @ApiDescription('Actualizar un mensaje de contacto por ID', [
    PermisoEnum.MENSAJES_CONTACTO_EDITAR,
  ])
  @Audit({
    accion: TipoAccionEnum.UPDATE,
    modulo: 'contacto',
    tabla: 'MensajeContacto',
    descripcion: 'Actualizar mensaje de contacto',
  })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMensajeContactoDto,
    @AuthUser() session: IToken,
  ) {
    return this.mensajeContactoService.update(id, updateDto, session);
  }

  @Delete(':id')
  @BearerAuthPermision([PermisoEnum.MENSAJES_CONTACTO_ELIMINAR])
  @ApiResponse({ status: 200, type: () => ResponseMensajeContactoType })
  @ApiDescription('Eliminar un mensaje de contacto por ID', [
    PermisoEnum.MENSAJES_CONTACTO_ELIMINAR,
  ])
  @Audit({
    accion: TipoAccionEnum.DELETE,
    modulo: 'contacto',
    tabla: 'MensajeContacto',
    descripcion: 'Eliminar mensaje de contacto',
  })
  remove(@Param('id') id: string) {
    return this.mensajeContactoService.remove(id);
  }
}
