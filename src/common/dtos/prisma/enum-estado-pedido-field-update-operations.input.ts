import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EstadoPedido } from '../../../enums/estado-pedido.enum';

export class EnumEstadoPedidoFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ enum: EstadoPedido })
  set?: `${EstadoPedido}`;
}
