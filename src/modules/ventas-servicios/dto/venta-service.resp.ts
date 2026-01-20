import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from '../../../common/dtos';

class CatalogoServicioDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  codigo: string;

  @ApiProperty()
  nombre: string;

  @ApiProperty()
  descripcion: string;

  @ApiProperty()
  precioBase: string;

  @ApiProperty()
  tarifaVariable: boolean;
}

class DetalleVentaDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: CatalogoServicioDto })
  catalogoServicio: CatalogoServicioDto;

  @ApiProperty()
  cantidad: string;

  @ApiProperty()
  precioUnitario: string;

  @ApiProperty()
  precioCatalogo: string;

  @ApiProperty()
  subtotal: string;

  @ApiProperty()
  descuento: string;

  @ApiProperty({ nullable: true })
  codigoActividadSin: string | null;
}

class VentaServiceDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clienteId: string;

  @ApiProperty()
  tipoTransaccion: string;

  @ApiProperty()
  numeroTransaccion: string;

  @ApiProperty()
  fecha: string;

  @ApiProperty()
  total: string;

  @ApiProperty({ nullable: true })
  observaciones: string | null;

  @ApiProperty()
  estado: string;

  @ApiProperty()
  userCreateId: string;

  @ApiProperty({ nullable: true })
  userUpdateId: string | null;

  @ApiProperty()
  fechaCreacion: string;

  @ApiProperty({ nullable: true })
  fechaActualizacion: string | null;

  @ApiProperty({ type: [DetalleVentaDto] })
  detalles: DetalleVentaDto[];
}

export class VentaServiceResp extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: VentaServiceDto })
  declare response: VentaServiceDto;
}

class PaginatePagosIngresosData extends OmitType(ResponseStructDTO, ['validationErrors']) {
  @ApiProperty({ type: [VentaServiceResp] })
  data?: VentaServiceResp[];
}

export class PaginateVentasServiciosType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: PaginatePagosIngresosData })
  declare response: PaginatePagosIngresosData;
}
