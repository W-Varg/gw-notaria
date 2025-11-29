import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedIntFilter } from './nested-int-filter.input';

export class IntFilter {
  @Expose()
  @ApiPropertyOptional({ type: Number })
  equals?: number;

  @Expose()
  @ApiPropertyOptional({ type: [Number] })
  in?: Array<number>;

  @Expose()
  @ApiPropertyOptional({ type: [Number] })
  notIn?: Array<number>;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  lt?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  lte?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  gt?: number;

  @Expose()
  @ApiPropertyOptional({ type: Number })
  gte?: number;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  not?: NestedIntFilter;
}
