import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UnidadMedida } from '../../../enums/unidad-medida.enum';

export class EnumUnidadMedidaFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ enum: UnidadMedida })
  set?: `${UnidadMedida}`;
}
