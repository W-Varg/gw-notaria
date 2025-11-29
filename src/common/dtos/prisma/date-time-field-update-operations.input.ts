import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class DateTimeFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ type: Date })
  set?: Date | string;
}
