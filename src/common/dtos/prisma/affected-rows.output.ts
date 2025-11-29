import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AffectedRows {
  @Expose()
  @ApiProperty({ type: Number })
  count!: number;
}
