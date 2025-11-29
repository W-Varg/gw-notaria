import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BoolFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ type: Boolean })
  set?: boolean;
}
