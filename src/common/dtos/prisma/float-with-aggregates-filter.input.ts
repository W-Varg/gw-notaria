import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { NestedFloatWithAggregatesFilter } from './nested-float-with-aggregates-filter.input';
import { NestedIntFilter } from './nested-int-filter.input';
import { NestedFloatFilter } from './nested-float-filter.input';

export class FloatWithAggregatesFilter {
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
  @ApiPropertyOptional({ type: () => NestedFloatWithAggregatesFilter })
  not?: NestedFloatWithAggregatesFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedIntFilter })
  _count?: NestedIntFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatFilter })
  _avg?: NestedFloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatFilter })
  _sum?: NestedFloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatFilter })
  _min?: NestedFloatFilter;

  @Expose()
  @ApiPropertyOptional({ type: () => NestedFloatFilter })
  _max?: NestedFloatFilter;
}
