import { Body, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { VentasServiciosService } from './ventas-servicios.service';
import { CrearVentaInput } from './dto/crear-venta.input';
import { AuthUser, IToken } from '../../common/decorators/token.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { BearerAuthPermision } from '../../common/decorators/authorization.decorator';
import { ApiDescription } from '../../common/decorators/controller.decorator';
import { Audit } from '../../common/decorators/audit.decorator';
import { TipoAccionEnum } from '../../enums';
import { ListFindAllQueryDto } from '../../common/dtos';
import { CommonParamsDto } from '../../common/dtos/common-params.dto';
import { PaginateVentasServiciosType, VentaServiceResp } from './dto/venta-service.resp';

@ApiTags('VENTAS SERVICIOS')
@Controller('ventas-servicios')
@UseInterceptors(AuditInterceptor)
export class VentasServiciosController {
  constructor(private readonly ventasServiciosService: VentasServiciosService) {}

  @Get()
  @BearerAuthPermision([])
  @ApiDescription('Listar todas las ventas', [])
  @ApiResponse({ type: PaginateVentasServiciosType })
  findAll(@Query() query: ListFindAllQueryDto) {
    return this.ventasServiciosService.findAll(query);
  }

  @Get(':id')
  @BearerAuthPermision([])
  @ApiResponse({ type: VentaServiceResp })
  @ApiDescription('Obtener una venta por ID', [])
  findOne(@Param() params: CommonParamsDto.IdString) {
    return this.ventasServiciosService.findOne(params.id);
  }

  @Post()
  @BearerAuthPermision([])
  @ApiDescription('Crear una nueva comercializadora', [])
  @Audit({
    accion: TipoAccionEnum.CREATE,
    modulo: 'VentasServicios',
    tabla: 'fac_ventas_servicios',
    descripcion: 'Crear nueva ventas',
  })
  crearVenta(@Body() dto: CrearVentaInput, @AuthUser() session: IToken) {
    return this.ventasServiciosService.crearVenta(dto, session.usuarioId);
  }
}
