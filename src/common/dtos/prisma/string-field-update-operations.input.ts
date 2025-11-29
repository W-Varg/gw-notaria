import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StringFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ type: String })
  set?: string;
}
