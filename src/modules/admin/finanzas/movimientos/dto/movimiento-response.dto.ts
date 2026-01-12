import { Decimal } from '@prisma/client/runtime/client';
import { IMovimiento } from '../interfaces/imovimiento';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto } from 'src/common/dtos';

class MovimientoResponse {
  @ApiProperty({ type: [IMovimiento] })
  movimientos: IMovimiento[];
  @ApiProperty({ type: Number })
  totalIngresosEfectivo: Decimal;
  @ApiProperty({ type: Number })
  totalIngresosBancos: Decimal;
  @ApiProperty({ type: Number })
  totalEgresosEfectivo: Decimal;
  @ApiProperty({ type: Number })
  totalEgresosBancos: Decimal;
  @ApiProperty({ type: Number })
  saldoFinal: Decimal;
}

export class MovimientoResponseDto extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MovimientoResponse })
  declare response: MovimientoResponse;
}
