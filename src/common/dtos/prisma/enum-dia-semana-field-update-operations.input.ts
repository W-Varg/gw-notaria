import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DiaSemana } from '../../../enums/dia-semana.enum';

export class EnumDiaSemanaFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ enum: DiaSemana })
  set?: `${DiaSemana}`;
}
