import { Decimal } from '@prisma/client/runtime/client';
import { IMovimiento } from '../interfaces/imovimiento';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ApiOkResponseDto } from 'src/common/dtos';

class MovimientoResponse {
  @ApiProperty({ type: [IMovimiento] })
  movimientos: IMovimiento[];
  @ApiProperty({ type: Number })
  totalIngresos: Decimal;
  @ApiProperty({ type: Number })
  totalEgresos: Decimal;
  @ApiProperty({ type: Number })
  saldoFinal: Decimal;
}

export class MovimientoResponseDto extends OmitType(ApiOkResponseDto, ['cache']) {
  @ApiProperty({ type: MovimientoResponse })
  declare response: MovimientoResponse;
}
