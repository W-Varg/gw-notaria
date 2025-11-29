import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class NullableFloatFieldUpdateOperationsInput {
  @Expose()
  @ApiPropertyOptional({ type: Number })
  set?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  increment?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  decrement?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  multiply?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  divide?: number;
}
