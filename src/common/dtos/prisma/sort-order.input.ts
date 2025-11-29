import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SortOrder } from './sort-order.enum';
import { NullsOrder } from './nulls-order.enum';

export class SortOrderInput {
  @Expose()
  @ApiProperty({ enum: SortOrder })
  sort!: `${SortOrder}`;

  @Expose()
  @ApiPropertyOptional({ enum: NullsOrder })
  nulls?: `${NullsOrder}`;
}
