import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto, ResponseStructDTO } from 'src/common/dtos/response.dto';

// Tipos de datos base para alertas
export class StockAlertType {
  @ApiProperty({ type: String })
  id: string;

  @ApiProperty({ type: String })
  productoId: string;

  @ApiProperty({ type: String })
  sucursalId: string;

  @ApiProperty({ type: String })
  productoNombre: string;

  @ApiProperty({ type: String })
  sucursalNombre: string;

  @ApiProperty({ type: Number })
  stockActual: number;

  @ApiProperty({ type: Number })
  stockMinimo: number;

  @ApiProperty({ type: Number })
  stockMaximo: number;

  @ApiProperty({ type: Number })
  diferencia: number;

  @ApiProperty({ type: Number })
  porcentajeStock: number;
}

// Tipo extendido para productos que necesitan reabastecimiento
export class RestockAlertType extends StockAlertType {
  @ApiProperty({ type: Number, required: false })
  cantidadRecomendada?: number;

  @ApiProperty({ type: Number, required: false })
  valorRecomendado?: number;
}

// Tipo para estadísticas de stock
export class StockStatisticsType {
  @ApiProperty({ type: Number })
  totalInventarios: number;

  @ApiProperty({ type: Number })
  lowStockCount: number;

  @ApiProperty({ type: Number })
  criticalStockCount: number;

  @ApiProperty({ type: Number })
  outOfStockCount: number;

  @ApiProperty({ type: Number })
  healthyStockCount: number;
}

// Tipo para respuesta de verificación manual
export class StockCheckResultType {
  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: Date })
  checkedAt: Date;
}

/* ------------------------------------------------------------------------------------------------------------------ */

// Clases de datos para respuestas
class StockAlertsData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: [StockAlertType] })
  data: StockAlertType[];
}

export class ResponseStockAlertsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: StockAlertsData })
  declare response: StockAlertsData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class RestockAlertsData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: [RestockAlertType] })
  data: RestockAlertType[];
}

export class ResponseRestockAlertsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: RestockAlertsData })
  declare response: RestockAlertsData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class StockStatisticsData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: StockStatisticsType })
  data: StockStatisticsType;
}

export class ResponseStockStatisticsType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: StockStatisticsData })
  declare response: StockStatisticsData;
}

/* ------------------------------------------------------------------------------------------------------------------ */

class StockCheckData extends OmitType(ResponseStructDTO, ['pagination']) {
  @ApiProperty({ type: StockCheckResultType })
  data: StockCheckResultType;
}

export class ResponseStockCheckType extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: StockCheckData })
  declare response: StockCheckData;
}
