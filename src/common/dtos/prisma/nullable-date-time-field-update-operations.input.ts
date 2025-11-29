import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NullableDateTimeFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ type: Date })
  set?: Date | string;
}
