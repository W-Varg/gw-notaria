import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NullableStringFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ type: String })
  set?: string;
}
