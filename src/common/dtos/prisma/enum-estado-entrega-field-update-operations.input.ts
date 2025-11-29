import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EstadoEntrega } from '../../../enums/estado-entrega.enum';

export class EnumEstadoEntregaFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ enum: EstadoEntrega })
  set?: `${EstadoEntrega}`;
}
